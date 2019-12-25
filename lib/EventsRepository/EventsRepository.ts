import {
  TListener,
  IEventsRepository,
  TDetectListener,
  TTransformableEvent,
} from './types';
import {ISocket} from '../Socket';
import {parseIRCMessage, prepareIRCMessage} from '../utils';
import transformers from './transformers';

import {isSignalListener} from './utils';

class EventsRepository implements IEventsRepository {
  private readonly listeners: TListener[] = [];
  private readonly socket: ISocket;
  private readonly login: string;

  public constructor(socket: ISocket, login: string) {
    this.login = login.toLowerCase();
    this.socket = socket;
    this.socket.on('message', this.onMessage);
  }

  /**
   * Parses incoming message and triggers event listeners.
   * @param {MessageEvent} event
   */
  private onMessage = (event: MessageEvent) => {
    const preparedMessages = prepareIRCMessage(event.data as string);

    preparedMessages.forEach(message => {
      const parsedMessage = parseIRCMessage(message);

      // Check if there are bound listeners to this command.
      this.listeners.forEach(item => {
        if (item.event === parsedMessage.signal) {
          if (isSignalListener(item)) {
            const {event, listener} = item;

            // We have to pre-transform parameters to format, applicable
            // by specific listener.
            const transform = transformers[event];
            const transformed = transform(this.login, parsedMessage);

            listener(transformed);
          } else {
            item.listener(parsedMessage);
          }
        }
      });
    });
  };

  public on = <Event extends TTransformableEvent | string>(
    event: Event,
    listener: TDetectListener<Event>,
  ) => this.listeners.push({event, listener});

  public off = <Event extends TTransformableEvent | string>(
    event: Event,
    listener: TDetectListener<Event>,
  ) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.event === event,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);
    }
  };
}

export default EventsRepository;
