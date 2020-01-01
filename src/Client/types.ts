import {ISocket} from '../Socket';
import {IEventsRepository} from '../EventsRepository';
import {IChannelsRepository} from '../ChannelsRepository';
import {IChannelsForkedRepository} from '../ChannelsForkedRepository';
import {ICloseEvent, IMessageEvent} from 'websocket';

export interface IAuthInfo {
  login: string;
  password: string;
}

export interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
  channels?: string[];
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
   * Create a client connection to IRC.
   */
  connect: ISocket['connect'];
  /**
   * Disconnects web socket.
   */
  disconnect: ISocket['disconnect'];
  /**
   * Shortcut to commands events binding. Make listener call when command
   * is being detected.
   */
  on: IEventsRepository['on'];
  /**
   * Removes event listener from command.
   */
  off: IEventsRepository['off'];
  /**
   * Shortcut to socket.on('open').
   * @param callback
   * @param once
   */
  onConnected(callback: () => any, once?: boolean): void;
  /**
   * Shortcut to socket.on('close').
   * @param callback
   * @param once
   */
  onDisconnected(callback: (e: ICloseEvent) => any, once?: boolean): void;
  /**
   * Shortcut to socket.on('error').
   * @param callback
   * @param once
   */
  onError(callback: (e: Error) => any, once?: boolean): void;
  /**
   * Shortcut to socket.on('close').
   * @param callback
   * @param once
   */
  onMessage(callback: (e: IMessageEvent) => any, once?: boolean): void;
  /**
   * Returns channels repository for passed channel. Useful when you dont want
   * to always pass channel parameter while calling client.channels methods.
   * @param channel
   */
  fork(channel: string): IChannelsForkedRepository;
}
