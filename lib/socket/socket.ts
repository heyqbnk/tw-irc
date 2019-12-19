import {
  ESocketReadyState,
  IListener,
  ISocket,
  ISocketConstructorProps,
  TListeningManipulator,
} from './types';

import {ESignal, IAuthInfo} from '../types';

import {parseIRCMessage, prepareIRCMessage} from '../utils';

class Socket implements ISocket {
  private readonly path: string;
  private readonly listeners: IListener[] = [];
  private readonly auth: IAuthInfo;
  private socket: WebSocket | null = null;

  public constructor(props: ISocketConstructorProps) {
    const {
      secure,
      auth: {login, password},
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
   * This listener is required to detect Twitch PING message to respond
   * with PONG.
   */
  private onMessage = (event: MessageEvent) => {
    const message = event.data as string;
    const prepared = prepareIRCMessage(message);

    prepared.forEach(msg => {
      const {signal} = parseIRCMessage(msg);

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
    const {password, login} = this.auth;
    const {CapabilityRequest, Password, Nickname} = ESignal;

    // Request all capabilities.
    ['membership', 'tags', 'commands'].forEach(cap => {
      this.send(CapabilityRequest + ' :twitch.tv/' + cap);
    });

    // Standard authentication:
    // https://dev.twitch.tv/docs/irc/guide/
    this.send(Password + ' ' + password);
    this.send(Nickname + ' ' + login);
  };

  public connect = async (): Promise<void> => {
    if (this.socket) {
      this.socket.close();
    }
    // As WebSocket specification does not allow us to reconnect, we should
    // recreate this socket.
    this.socket = new WebSocket(this.path);

    // Bind previously bound listeners to new instance of WebSocket.
    this.listeners.forEach(({eventName, listener}) => {
      this.socket.addEventListener(eventName, listener);
    });

    // Add event listener on "open", to know, when connection is
    // successfully opened.
    return new Promise(res => {
      this.socket.addEventListener('open', () => res());
    });
  };

  public disconnect = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  public on: TListeningManipulator = (eventName, listener) => {
    this.listeners.push({eventName, listener});

    if (this.socket) {
      this.socket.addEventListener(eventName, listener);
    }
  };

  public off: TListeningManipulator = (eventName, listener) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.eventName === eventName,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);

      if (this.socket) {
        this.socket.removeEventListener(eventName, listener);
      }
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

export default Socket;