import {
  IAuthInfo,
  IClient,
  IClientConstructorProps,
  TListeningManipulator,
} from './types';
import { Socket } from '../socket';
import { EIRCCommand } from '../types';

import { UtilsRepository } from '../repositories/utils';
import { ChannelsRepository } from '../repositories/channels';
import { UsersRepository } from '../repositories/users';
import { EventsRepository } from '../repositories/events';

import {
  generateRandomAuth,
  isPasswordValid,
  warnInvalidPassword,
} from './utils';

class Client implements IClient {
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

  public readonly socket: Socket;
  public channels = new ChannelsRepository(this);
  public users = new UsersRepository(this);
  public utils: UtilsRepository;

  public constructor(props: IClientConstructorProps = {}) {
    const { secure, auth } = props;

    if (auth) {
      if (isPasswordValid(auth.password)) {
        this.auth = auth;
      } else {
        warnInvalidPassword(auth.password);

        // If auth data is invalid, generate some random authentication data
        this.auth = generateRandomAuth();
      }
    } else {
      this.auth = generateRandomAuth();
    }

    const socket = new Socket({ secure });
    socket.on('open', this.onWebSocketOpen);

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
    this.utils.sendCommand(EIRCCommand.Message, {
      channel: channel || this.boundChannel,
      message,
    });
  };
}

export { Client };
