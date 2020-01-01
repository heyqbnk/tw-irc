import {
  IListener,
  IEventsRepository,
  TListeningManipulator,
} from './types';
import {ISocket} from '../Socket';

import transformers from './transformers';
import {prepareIRCMessage, parseIRCMessage} from '../utils';

class EventsRepository implements IEventsRepository {
  private readonly listeners: IListener[] = [];
  private readonly socket: ISocket;

  public constructor(socket: ISocket) {
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

      if (parsedMessage) {
        // Check if there are bound listeners to this command.
        this.listeners.forEach(item => {
          if (item.event === parsedMessage.command) {
            const transformer = transformers[item.event];
            item.listener(transformer(parsedMessage));
          }
        });
      }
    });
  };

  public on: TListeningManipulator = (event, listener) => this.listeners.push({
    event,
    listener,
  });

  public off: TListeningManipulator = (event, listener) => {
    const foundIndex = this.listeners.findIndex(
      item => item.listener === listener && item.event === event,
    );

    if (foundIndex > -1) {
      this.listeners.splice(foundIndex, 1);
    }
  };
}

export default EventsRepository;
