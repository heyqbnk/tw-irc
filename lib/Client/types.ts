import {IAuthInfo, IRoom} from '../types';

import {ISocket} from '../Socket';
import {TListeningManipulator} from '../EventsRepository';
import {IRoomsRepository} from '../RoomsRepository';
import {IRoomsForkedRepository} from '../RoomsForkedRepository';
import {IChannelsRepository} from '../ChannelsRepository';
import {IChannelsForkedRepository} from '../ChannelsForkedRepository';

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
  socket: ISocket;
  /**
   * Repository to work with channels.
   */
  channels: IChannelsRepository;
  /**
   * Repository to communicate with users.
   */
  rooms: IRoomsRepository;
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
   * Shortcut to socket.on('open').
   * @param callback
   */
  onConnected(callback: (e: Event) => any): void;
  /**
   * Shortcut to socket.on('close').
   * @param callback
   */
  onDisconnected(callback: (e: CloseEvent) => any): void;
  /**
   * Shortcut to socket.on('error').
   * @param callback
   */
  onError(callback: (e: Event) => any): void;
  /**
   * Shortcut to socket.on('close').
   * @param callback
   */
  onMessage(callback: (e: MessageEvent) => any): void;
  /**
   * Returns channels repository for passed channel.
   * @param channel
   */
  forkChannel(channel: string): IChannelsForkedRepository;
  /**
   * Returns rooms repository for passed room.
   * @param room
   */
  forkRoom(room: IRoom): IRoomsForkedRepository;
}
