import {
  ESocketReadyState,
  IAuthData,
  IListener,
  ISocket,
  ISocketConstructorProps,
  TListeningManipulator,
} from './types';
import { ESignal } from '../types';
import { parseIRCMessage, prepareIRCMessage } from '../utils';

export class Socket implements ISocket {
  private readonly path: string;
  private readonly listeners: IListener[] = [];
  private socket: WebSocket;
  private readonly auth: IAuthData;

  public constructor(props: ISocketConstructorProps) {
    const {
      secure,
      auth: { login, password },
    } = props;

    this.auth = {
      login: login.toLowerCase(),
      password: password.toLowerCase(),
    };
    this.path = secure
      ? 'wss://irc-ws.chat.twitch.tv:443'
      : 'ws://irc-ws.chat.twitch.tv:80';

    this.on('message', this.onMessage);
    this.on('open', this.onOpen);
  }

  /**
   * Rebinds listeners to WebSocket
   */
  private bindEvents = () => {
    if (!this.socket) {
      throw new Error('WebSocket was not initialized');
    }
    this.listeners.forEach(({ eventName, listener }) => {
      // Firstly remove already added event listener. We cannot check if
      // is already bound, so lets just remove.
      this.socket.removeEventListener(eventName, listener);

      // Then add it again/
      this.socket.addEventListener(eventName, listener);
    });
  };

  /**
   * This listener is required to detect Twitch PING message to respond
   * with PONG.
   */
  private onMessage = (event: MessageEvent) => {
    const message = event.data as string;
    const prepared = prepareIRCMessage(message);

    prepared.forEach(msg => {
      const { signal } = parseIRCMessage(msg);

      if (signal === ESignal.Ping) {
        // If command was PING, respond with PONG.
        this.send(ESignal.Pong);
      } else if (signal === ESignal.Reconnect) {
        // If command was RECONNECT, just reconnect.
        this.disconnect();
        this.connect();
      }
    });
  };

  /**
   * Handler, responsible for requesting capabilities
   */
  private onOpen = () => {
    const { password, login } = this.auth;

    // Request all capabilities.
    ['membership', 'tags', 'commands'].forEach(cap => {
      this.send(`${ESignal.CapabilityRequest} :twitch.tv/${cap}`);
    });

    // Standard authentication:
    // https://dev.twitch.tv/docs/irc/guide/
    this.send(ESignal.Password + ' ' + password);
    this.send(ESignal.Nickname + ' ' + login);
  };

  public connect = () => {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(this.path);
    this.bindEvents();
  };

  public disconnect = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  public on: TListeningManipulator = (eventName, listener) => {
    this.listeners.push({ eventName, listener });

    if (this.socket) {
      this.bindEvents();
    }
  };

  public off: TListeningManipulator = (eventName, listener) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.eventName === eventName,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);
    }
  };

  public getReadyState = (): ESocketReadyState => {
    if (!this.socket) {
      return ESocketReadyState.Closed;
    }

    return this.socket.readyState as ESocketReadyState;
  };

  public send = (message: string) => {
    if (!this.socket) {
      throw new Error('Socket was not initialized. Call connect() first.');
    }
    this.socket.send(message);
  };
}
