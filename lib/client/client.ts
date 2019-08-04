import {
  IAuthInfo,
  IClient,
  IClientConstructorProps,
  TListeningManipulator,
} from './types';
import { Socket } from '../socket';
import { ESignal } from '../types';

import { UtilsRepository } from '../repositories/utils';
import { ChannelsRepository } from '../repositories/channels';
import { UsersRepository } from '../repositories/users';
import { EventsRepository } from '../repositories/events';

import { generateRandomAuth, isPasswordValid } from './utils';

class Client implements IClient {
  /**
   * Bound channel for client.
   */
  private boundChannel: string | undefined;

  /**
   * Repository responsible for events binding.
   */
  private events: EventsRepository;

  public readonly socket: Socket;
  public channels = new ChannelsRepository(this);
  public users = new UsersRepository(this);
  public utils: UtilsRepository;

  public constructor(props: IClientConstructorProps = {}) {
    const { secure, auth: initialAuth } = props;
    let auth: IAuthInfo;

    if (initialAuth) {
      if (!isPasswordValid(initialAuth.password)) {
        throw new Error(
          `Stated password "${initialAuth.password}" is invalid. ` +
          'It should start with "oauth:". Your auth data will be ignored. ' +
          'Please follow these instructions to get more info:\n' +
          'https://twitchapps.com/tmi/\n' +
          'https://dev.twitch.tv/docs/authentication/',
        );
      }
      auth = initialAuth;
    } else {
      auth = generateRandomAuth();
    }

    const socket = new Socket({ secure, auth });

    this.socket = socket;

    // Initialize repositories.
    this.utils = new UtilsRepository(socket);
    this.events = new EventsRepository(socket, auth.login);
  }

  public connect = () => this.socket.connect();

  public disconnect = () => this.socket.disconnect();

  public on: TListeningManipulator = (command, listener) => {
    this.events.on(command, listener);
  };

  public off: TListeningManipulator = (command, listener) => {
    this.events.off(command, listener);
  };

  public bindChannel = (channel: string) => this.boundChannel = channel;

  public say = (message: string, channel?: string) => {
    if (!channel && !this.boundChannel) {
      throw new Error('Cannot send message due to channel is not stated');
    }
    this.utils.sendSignal(ESignal.Message, {
      channel: channel || this.boundChannel,
      message,
    });
  };
}

export { Client };
