import { ESocketReadyState } from '../types';

interface ISocketConstructorProps {
  /**
   * Sets security connection security level.
   */
  secure: boolean;
}

interface IListener {
  eventName: keyof WebSocketEventMap;
  listener(ev: Event): void;
}

type TListeningManipulator = <K extends keyof WebSocketEventMap>(
  eventName: K,
  listener: (ev: WebSocketEventMap[K]) => any,
) => void;

/**
 * Implementation for Socket class.
 */
interface ISocket {
  /**
   * Initializes a socket connection.
   */
  connect(): void;

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

export { ISocketConstructorProps, IListener, ISocket, TListeningManipulator };
