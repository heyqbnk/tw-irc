import { IAuthInfo, IClientConstructorProps } from './types';
import { Socket } from '../socket';
import { EIRCCommand, TObservableEvents } from '../types';

import { UtilsRepository } from '../repositories/utils';
import { ChannelsRepository } from '../repositories/channels';
import { UsersRepository } from '../repositories/users';
import {
  EventsRepository,
  TCallback,
  TCallbacksMap,
} from '../repositories/events';
import { parseIRCMessage, prepareIRCMessage } from '../utils';
import { generateRandomLogin } from './utils';

class Client {
  /**
   * Authentication data.
   */
  private readonly auth: IAuthInfo;

  /**
   * Bound channel for client.
   */
  private boundChannel: string | undefined;

  /**
   * Repository responsible for events binding.
   */
  private events: EventsRepository;

  /**
   * Custom Socket instance.
   */
  public readonly socket: Socket;

  /**
   * Repository to work with channels.
   * @type {ChannelsRepository}
   */
  public channels = new ChannelsRepository(this);

  /**
   * Repository to communicate with users.
   * @type {UsersRepository}
   */
  public users = new UsersRepository(this);

  /**
   * Repository containing some useful methods.
   */
  public utils: UtilsRepository;

  public constructor(props: IClientConstructorProps = {}) {
    const { secure, auth } = props;

    // If auth data is not set, we have to do it. This data was taken
    // from websocket frames on somebody's channel.
    this.auth = auth || {
      login: generateRandomLogin(),
      password: generateRandomLogin(),
    };
    const socket = new Socket({ secure });
    socket.on('open', this.onWebSocketOpen);
    socket.on('message', this.onWebSocketMessage);

    // Initialize repositories.
    this.utils = new UtilsRepository(socket);
    this.events = new EventsRepository(socket);

    this.socket = socket;
  }

  /**
   * Listener which requests required capabilities and authenticates user.
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

  /**
   * Create a client connection to IRC.
   */
  public connect = () => this.socket.connect();

  /**
   * Disconnects web socket.
   */
  public disconnect = () => this.socket.disconnect();

  /**
   * Shortcut to commands events binding.
   * @param command
   * @param {TCallbacksMap[Command]} listener
   * @returns {number}
   */
  public on = <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => this.events.on(command, listener);

  /**
   * Shortcut to commands events unbinding.
   * @param {TCallbacksMap[Command]} listener
   * @returns {number}
   */
  public off = <Listener extends TCallback<any>>(listener: Listener) =>
    this.events.off(listener);

  /**
   * Binds this client to stated channel.
   * @param {string} channel
   */
  public bindChannel = (channel: string) => (this.boundChannel = channel);

  /**
   * Say a message to channel.
   * @param {string} message
   * @param {string} channel
   */
  public say = (message: string, channel?: string) => {
    if (!channel && !this.boundChannel) {
      throw new Error('Cannot send message due to channel is not stated');
    }
    this.utils.sendCommand(EIRCCommand.Message, {
      channel: channel || this.boundChannel,
      message,
    });
  };
}

export { Client };
