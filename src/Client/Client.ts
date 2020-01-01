import {IAuthInfo, IClient, IClientConstructorProps} from './types';
import {ECommand} from '../types';

import Socket, {ISocket} from '../Socket';
import ChannelsRepository from '../ChannelsRepository';
import ChannelsForkedRepository from '../ChannelsForkedRepository';
import EventsRepository, {TListeningManipulator} from '../EventsRepository';

import {generateRandomAuth, isPasswordValid} from './utils';

class Client implements IClient {
  public readonly socket: ISocket;
  public channels: ChannelsRepository;
  private readonly auth: IAuthInfo;
  private events: EventsRepository;
  private initialChannels: string[] = [];

  public constructor(props: IClientConstructorProps = {}) {
    const {secure, auth, channels} = props;

    if (auth) {
      const {password} = auth;

      if (!isPasswordValid(password)) {
        throw new Error(
          `Passed password "${password}" is invalid. ` +
          'It should start with "oauth:". Your auth data will be ignored. ' +
          'Please follow these instructions to get more info:\n' +
          'https://twitchapps.com/tmi/\n' +
          'https://dev.twitch.tv/docs/authentication/',
        );
      }
      this.auth = auth;
    } else {
      this.auth = generateRandomAuth();
    }

    // Initialize repositories.
    this.socket = new Socket({secure});
    this.events = new EventsRepository(this.socket);
    this.channels = new ChannelsRepository(this.socket);

    // Join channels if passed.
    if (channels) {
      this.initialChannels = channels;
    }

    // Login each time socket connection is established.
    this.onConnected(() => this.init());
  }

  /**
   * Handler, responsible for requesting capabilities and joining initial
   * channels.
   */
  private init = () => {
    const {password, login} = this.auth;
    const {CapabilityRequest, Password, Nickname} = ECommand;

    // Request all capabilities.
    ['membership', 'tags', 'commands'].forEach(cap => {
      this.socket.send(CapabilityRequest + ' :twitch.tv/' + cap);
    });

    // Standard authentication: https://dev.twitch.tv/docs/irc/guide/
    this.socket.send(Password + ' ' + password);
    this.socket.send(Nickname + ' ' + login);

    this.initialChannels.forEach(channel => this.channels.join(channel));
  };

  public connect = async () => {
    return this.socket.connect();
  };

  public disconnect = () => this.socket.disconnect();

  public onConnected = (callback: (e: Event) => any, once?: boolean) => {
    this.socket.on('open', callback, once);
  };

  public onDisconnected = (
    callback: (e: CloseEvent) => any,
    once?: boolean,
  ) => this.socket.on('close', callback, once);

  public onMessage = (callback: (e: MessageEvent) => void, once?: boolean) => {
    this.socket.on('message', callback, once);
  };

  public onError = (callback: (e: Event) => void, once?: boolean) => {
    this.socket.on('error', callback, once);
  };

  public on: TListeningManipulator = (event, listener) => {
    this.events.on(event, listener);
  };

  public off: TListeningManipulator = (event, listener) => {
    this.events.off(event, listener);
  };

  public fork = (channel: string) => {
    return new ChannelsForkedRepository(this.socket, channel);
  };
}

export default Client;
