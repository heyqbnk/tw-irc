import {
  IAuthInfo,
  IClientConstructorProps,
  TChannelCommand,
  TUserCommand,
} from './types';
import { EIRCCommand } from '../types/irc';
import { UtilsRepository } from '../repositories/utils';
import { EventsRepository, TCallbacksMap } from '../repositories/events';
import { TObservableEvents } from '../types/event-params';
import { ChannelsRepository } from '../repositories/channels';
import { parseIRCMessage, prepareIRCMessage } from '../utils';
import { generateRandomLogin } from './utils';

class Client {
  private readonly auth: IAuthInfo;
  private readonly webSocketPath: string;
  private webSocket: WebSocket;

  public channels = new ChannelsRepository(this);
  public utils: UtilsRepository;
  public events: EventsRepository;

  public constructor(props: IClientConstructorProps = {}) {
    const { secure, auth } = props;

    // If auth data is not set, we have to do it. This data was taken
    // from websocket frames on somebody's channel.
    this.auth = auth || {
      login: generateRandomLogin(),
      password: 'SCHMOOPIIE',
    };
    this.webSocketPath = secure
      ? 'wss://irc-ws.chat.twitch.tv:443'
      : 'ws://irc-ws.chat.twitch.tv:80';

    // Create WebSocket connection and initialize repos.
    this.connect();
  }

  /**
   * Initializes client. The main method's purpose is to disconnect previous
   * WebSocket, create new one, bind life-required listeners (ping-response)
   * and reinitialize repositories.
   *
   * Remember, that while using this method, all bound WebSocket events will
   * disappear and you have to bind them again.
   */
  private connect = () => {
    // Disconnect previous WebSocket.
    if (this.webSocket) {
      this.disconnect();
    }
    const webSocket = new WebSocket(this.webSocketPath);

    // Initialize repositories.
    this.utils = new UtilsRepository(webSocket);
    this.events = new EventsRepository(webSocket);

    webSocket.addEventListener('open', this.onWebSocketOpen);

    this.webSocket = webSocket;
  };

  /**
   * Disconnects web socket.
   */
  public disconnect = () => this.webSocket.close();

  /**
   * Shortcut to commands listening.
   * @param command
   * @param {TCallbacksMap[Command]} listener
   * @returns {number}
   */
  public on = <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => this.events.on(command, listener);

  /**
   * Shortcut to socket events listening.
   * @param {K} eventName
   * @param {(ev: WebSocketEventMap[K]) => any} listener
   */
  public onWebSocket = <K extends keyof WebSocketEventMap>(
    eventName: K,
    listener: (ev: WebSocketEventMap[K]) => any,
  ) => this.webSocket.addEventListener(eventName, listener);

  /**
   * Listener which request required capabilities, authenticates user
   * and add listener to PING command to respond with PONG.
   */
  private onWebSocketOpen = () => {
    // tslint:disable-next-line:no-this-assignment
    const {
      auth: { password, login },
      utils: { sendRawMessage },
    } = this;

    // Request all capabilities.
    ['membership', 'tags', 'commands'].forEach(cap => {
      sendRawMessage(`${EIRCCommand.CapabilityRequest} :twitch.tv/${cap}`);
    });

    // Standard authentication:
    // https://dev.twitch.tv/docs/irc/guide/
    sendRawMessage(`${EIRCCommand.Password} ${password}`);
    sendRawMessage(`${EIRCCommand.Nickname} ${login}`);

    this.onWebSocket('message', this.onWebSocketMessage);
  };

  /**
   * This listener is required to detect Twitch PING message to respond
   * with PONG.
   */
  private onWebSocketMessage = (event: MessageEvent) => {
    const message = event.data as string;
    const prepared = prepareIRCMessage(message);

    prepared.forEach(msg => {
      const parsed = parseIRCMessage(msg);

      // If command was PING, respond with PONG
      if (parsed.command === EIRCCommand.Ping) {
        this.utils.sendRawMessage(EIRCCommand.Pong);
      }
    });
  };

  private userCommand = (command: string): TUserCommand => {
    return (channel, user) => this.say(channel, `${command} ${user}`);
  };

  private channelCommand = (command: string): TChannelCommand => {
    return channel => this.say(channel, command);
  };

  // Ban / unban user
  public ban = this.userCommand('/ban');
  public unban = this.userCommand('/unban');

  // Enable emote only mode
  public emoteOnlyOn = this.channelCommand('/emoteonly');
  public emoteOnlyOff = this.channelCommand('/emoteonlyoff');

  // Followers mode
  public followersOnlyOn = this.channelCommand('/followers');
  public followersOnlyOff = this.channelCommand('/followersoff');

  // Hosting
  public host = this.channelCommand('/host');
  public unhost = () => this.channelCommand('/unhost');

  public marker = (channel: string, comment: string) =>
    this.say(channel, `/marker ${comment}`);
  public me = (channel: string, action: string) =>
    this.say(channel, `/me ${action}`);

  // Moderators
  public mod = this.userCommand('/mod');
  public unmod = this.userCommand('/unmod');

  // R9K
  public r9kOn = this.channelCommand('/r9kbeta');
  public r9kOff = this.channelCommand('/r9kbetaoff');

  // Raid
  public raid = this.userCommand('/raid');
  public unraid = this.channelCommand('/unraid');

  // Slowmode
  public slowmodeOn = (channel: string, secs = 30) =>
    this.say(channel, `/slow ${secs}`);
  public slowmodeOff = this.channelCommand('/slowoff');

  // Timeouts
  public timeout = (
    channel: string,
    user: string,
    duration = '10m',
    reason?: string,
  ) =>
    this.say(
      channel,
      `/timeout ${user} ${duration}${reason ? ` ${reason}` : ''}`,
    );
  public untimeout = this.userCommand('/untimeout');

  // VIP
  public vip = this.userCommand('/vip');
  public unvip = this.userCommand('/unvip');

  public clearChat = this.channelCommand('/clear');
  public changeColor = (channel: string, color: string) =>
    this.say(channel, `/color ${color}`);
  public runCommercial = (channel: string, secs: number) =>
    this.say(channel, `/commercial ${secs}`);
  public deleteMessage = (channel: string, msgId: string) =>
    this.say(channel, `/delete ${msgId}`);

  public whisper = (channel: string, user: string, message: string) =>
    this.say(channel, `/w ${user} ${message}`);

  public say = (channel: string, message: string) =>
    this.utils.sendCommand(EIRCCommand.Message, { channel, message });
}

export { Client };
