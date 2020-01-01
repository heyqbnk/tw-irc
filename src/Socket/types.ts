import {ESocketReadyState} from '../types';
import {ICloseEvent, IMessageEvent} from 'websocket';

export interface ISocketConstructorProps {
  /**
   * Sets security connection security level.
   */
  secure?: boolean;
}

export interface IWebSocketEventMap {
  close: ICloseEvent;
  error: Error;
  message: IMessageEvent;
  open: undefined;
}

export type TWebSocketEvent = keyof IWebSocketEventMap;

export interface IListener {
  eventName: TWebSocketEvent;
  listener(data?: any): any;
  once: boolean;
}

export type TAddEventListener = <K extends TWebSocketEvent>(
  type: K,
  listener: (ev: IWebSocketEventMap[K]) => any,
  once?: boolean,
) => void;

export type TRemoveEventListener = <K extends TWebSocketEvent>(
  type: K,
  listener: (ev: IWebSocketEventMap[K]) => any,
) => void;

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
  disconnect(): Promise<void>;
  /**
   * Adds socket event listener.
   */
  on: TAddEventListener;
  /**
   * Removes socket event listener.
   */
  off: TRemoveEventListener;
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
