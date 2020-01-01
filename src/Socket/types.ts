export interface ISocketConstructorProps {
  /**
   * Sets security connection security level.
   */
  secure?: boolean;
}

export interface IListener {
  eventName: keyof WebSocketEventMap;
  listener(ev: Event): void;
  once: boolean;
}

export type TAddEventListener = <K extends keyof WebSocketEventMap>(
  type: K,
  listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
  once?: boolean,
) => void;

export type TRemoveEventListener = <K extends keyof WebSocketEventMap>(
  type: K,
  listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
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
