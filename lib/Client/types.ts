import Socket from '../Socket';

import ChannelsRepository from '../ChannelsRepository';
import RoomsRepository from '../RoomsRepository';
import {TListeningManipulator} from '../EventsRepository';

import {IAuthInfo, IRoom} from '../types';

export interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

/**
 * Implementation for Client class.
 */
export interface IClient {
  /**
   * Socket instance. Used to create connection to IRC.
   */
  socket: Socket;
  /**
   * Repository to work with channels.
   */
  channels: ChannelsRepository;
  /**
   * Repository to communicate with users.
   */
  rooms: RoomsRepository;
  /**
   * Create a client connection to IRC.
   */
  connect(): Promise<void>;
  /**
   * Disconnects web socket.
   */
  disconnect(): void;
  /**
   * Shortcut to commands events binding. Make listener call when command
   * is being detected.
   */
  on: TListeningManipulator;
  /**
   * Removes event listener from command.
   */
  off: TListeningManipulator;
  /**
   * Binds this client to passed channel.
   * @param {string} channel
   */
  assignChannel(channel: string): void;
  /**
   * Binds this client to passed room.
   * @param room
   */
  assignRoom(room: IRoom): void;
}
