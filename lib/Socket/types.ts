import {IAuthInfo} from '../types';

export interface ISocketConstructorProps {
  /**
   * Sets security connection security level.
   */
  secure?: boolean;
  /**
   * Authentication information.
   */
  auth: IAuthInfo;
}

export interface IListener {
  eventName: keyof WebSocketEventMap;
  listener(ev: Event): void;
}

export type TListeningManipulator = <K extends keyof WebSocketEventMap>(
  eventName: K,
  listener: (e: WebSocketEventMap[K]) => any,
) => void;

/**
 * List of states of socket connection.
 */
export enum ESocketReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

/**
 * Implementation for Socket class.
 */
export interface ISocket {
  /**
   * Initializes a socket connection.
   */
  connect(): Promise<void>;
  /**
   * Closes socket connection.
   */
  disconnect(): void;
  /**
   * Adds socket event listener.
   */
  on: TListeningManipulator;
  /**
   * Removes socket event listener.
   */
  off: TListeningManipulator;
  /**
   * Gets current connection state.
   * @returns {ESocketReadyState}
   */
  getReadyState(): ESocketReadyState;
  /**
   * Sends a message by socket.
   * @param {string} message
   */
  send(message: string): void;
}
