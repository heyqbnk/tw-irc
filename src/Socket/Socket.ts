import {
  ESocketReadyState,
  IListener,
  ISocket,
  ISocketConstructorProps,
  TAddEventListener,
  TRemoveEventListener,
} from './types';

import {ECommand} from '../types';

import {parseIRCMessage, prepareIRCMessage} from '../utils';

class Socket implements ISocket {
  private readonly path: string;
  private readonly listeners: IListener[] = [];
  private ws: WebSocket | null = null;

  public constructor(props: ISocketConstructorProps) {
    const {secure} = props;
    this.path = secure
      ? 'wss://irc-ws.chat.twitch.tv:443'
      : 'ws://irc-ws.chat.twitch.tv:80';

    this.on('message', this.onMessage);
  }

  /**
   * This listener is required to detect Twitch PING message to respond
   * with PONG.
   */
  private onMessage = (event: MessageEvent) => {
    const message = event.data as string;
    const prepared = prepareIRCMessage(message);
    const {Ping, Pong, Reconnect} = ECommand;

    prepared.forEach(msg => {
      const parsed = parseIRCMessage(msg);

      if (parsed) {
        const {command} = parsed;

        if (command === Ping) {
          // If command was PING, respond with PONG.
          this.send(Pong);
        } else if (command === Reconnect) {
          // If command was RECONNECT, just reconnect.
          this.connect();
        }
      }
    });
  };

  public connect = async (): Promise<void> => {
    if (this.ws) {
      this.ws.close();
    }
    // As WebSocket specification does not allow us to reconnect, we should
    // recreate this socket.
    this.ws = new WebSocket(this.path);

    // Bind previously bound listeners to new instance of WebSocket.
    this.listeners.forEach(({eventName, listener, once}) => {
      this.ws.addEventListener(eventName, listener, {once});
    });

    // Add event listener on "open", to know, when connection is
    // successfully opened.
    return new Promise(res => {
      this.on('open', () => res(), true);
    });
  };

  public disconnect = (): Promise<void> => {
    if (!this.ws) {
      throw new Error('Socket was not initialized, call connect() first.');
    }
    return new Promise(res => {
      this.on('close', () => res(), true);
      this.ws.close();
    });
  };

  public on: TAddEventListener = (eventName, listener, once = false) => {
    this.listeners.push({eventName, listener, once});

    if (this.ws) {
      this.ws.addEventListener(eventName, event => {
        // If event is bound only once, we have to remove it from cache,
        // because after new WebSocket is created, "once" events will be lost.
        if (once) {
          const foundIndex = this.listeners.findIndex(item => {
            return item.eventName === eventName && item.listener === listener;
          });

          if (foundIndex > -1) {
            this.listeners.splice(foundIndex, 1);
          }
        }
        listener.call(this.ws, event);
      }, {once});
    }
  };

  public off: TRemoveEventListener = (eventName, listener) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.eventName === eventName,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);
    }
    if (this.ws) {
      this.ws.removeEventListener(eventName, listener);
    }
  };

  public getReadyState = (): ESocketReadyState => {
    if (!this.ws) {
      return ESocketReadyState.Closed;
    }

    return this.ws.readyState as ESocketReadyState;
  };

  public send = (message: string) => {
    if (!this.ws) {
      throw new Error('Socket was not initialized. Call connect() first.');
    }
    this.ws.send(message);
  };
}

export default Socket;
