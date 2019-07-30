import { IListener, ISocketConstructorProps } from './types';
import { ESocketReadyState } from '../types/irc';

class Socket {
  private readonly path: string;
  private readonly listeners: IListener[] = [];
  private socket: WebSocket;

  public constructor(props: ISocketConstructorProps) {
    const { secure } = props;

    this.path = secure
      ? 'wss://irc-ws.chat.twitch.tv:443'
      : 'ws://irc-ws.chat.twitch.tv:80';
  }

  private bindEvents = () => {
    if (!this.socket) {
      throw new Error('WebSocket was not initialized');
    }
    this.listeners.forEach(({ eventName, listener }) => {
      this.socket.addEventListener(eventName, listener);
    });
  };

  /**
   * Initializes a socket connection.
   */
  public connect = () => {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(this.path);
    this.bindEvents();
  };

  /**
   * Closes socket connection
   */
  public disconnect = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  /**
   * Binds event to socket.
   * @param {K} eventName
   * @param {(ev: WebSocketEventMap[K]) => any} listener
   */
  public on = <K extends keyof WebSocketEventMap>(
    eventName: K,
    listener: (ev: WebSocketEventMap[K]) => any,
  ) => {
    this.listeners.push({ eventName, listener });

    if (this.socket) {
      this.socket.addEventListener(eventName, listener);
    }
  };

  /**
   * Removes event listener.
   * @param eventName
   * @param {(ev: Event) => void} listener
   */
  public off = <K extends keyof WebSocketEventMap>(
    eventName: K,
    listener: (ev: WebSocketEventMap[K]) => any,
  ) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.eventName === eventName,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);
    }
  };

  /**
   * Gets current connection ready state.
   * @returns {ESocketReadyState}
   */
  public getReadyState = (): ESocketReadyState => {
    if (!this.socket) {
      return ESocketReadyState.Closed;
    }

    return this.socket.readyState as ESocketReadyState;
  };

  /**
   * Sends a message.
   * @param {string} message
   */
  public send = (message: string) => this.socket.send(message);
}

export { Socket };
