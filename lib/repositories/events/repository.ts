import {
  ISignalListener,
  IEventsRepository,
  TListeningManipulator,
} from './types';
import { parseIRCMessage, prepareIRCMessage } from '../../utils';
import { transformers } from './transformers';
import { Socket } from '../../socket';

export class EventsRepository implements IEventsRepository {
  private readonly commandListeners: ISignalListener[] = [];
  private readonly socket: Socket;
  private readonly login: string;

  public constructor(socket: Socket, login: string) {
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
      this.commandListeners.forEach(item => {
        if (item.event === parsedMessage.signal) {
          // We have to pre-transform parameters to format, applicable
          // by specific listener.
          const transform = transformers[parsedMessage.signal];

          item.listener(transform(this.login, parsedMessage));
        }
      });
    });
  };

  public on: TListeningManipulator = (event, listener) => {
    this.commandListeners.push({ event, listener });
  };

  public off: TListeningManipulator = (command, listener) => {
    const foundIndex = this.commandListeners.findIndex(
      item => item.listener === listener && item.event === command,
    );

    if (foundIndex > -1) {
      this.commandListeners.splice(foundIndex, 1);
    }
  };
}
