import {
  IAuthInfo,
  IClient,
  IClientConstructorProps,
  TListeningManipulator,
} from './types';
import { Socket } from '../socket';

import { ChannelsRepository } from '../repositories/channels';
import { RoomsRepository } from '../repositories/rooms';
import { EventsRepository } from '../repositories/events';

import { generateRandomAuth, isPasswordValid } from './utils';

class Client implements IClient {
  /**
   * Repository responsible for events binding.
   */
  private events: EventsRepository;

  public readonly socket: Socket;
  public channels: ChannelsRepository;
  public rooms: RoomsRepository;

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
    this.events = new EventsRepository(socket, auth.login);
    this.channels = new ChannelsRepository(socket);
    this.rooms = new RoomsRepository(socket);
  }

  public connect = async () => this.socket.connect();

  public disconnect = () => this.socket.disconnect();

  public on: TListeningManipulator = (signal, listener) => {
    this.events.on(signal, listener);
  };

  public off: TListeningManipulator = (signal, listener) => {
    this.events.off(signal, listener);
  };

  public assignChannel = (channel: string) => {
    this.channels.assign(channel);
  };

  public assignRoom = (room: { channelId: string, roomUuid: string }) => {
    this.rooms.assign(room);
  };
}

export { Client };
