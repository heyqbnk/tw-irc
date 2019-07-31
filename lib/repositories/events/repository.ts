import {
  ICommandListener,
  IEventsRepository,
  TListeningManipulator,
} from './types';
import { parseIRCMessage } from '../../utils';
import { transformers } from './transformers';
import { Socket } from '../../socket';

export class EventsRepository implements IEventsRepository {
  private readonly commandListeners: ICommandListener[] = [];
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('message', this.onMessage);
  }

  /**
   * Parses incoming message and triggers event listeners.
   * @param {MessageEvent} event
   */
  private onMessage = (event: MessageEvent) => {
    const parsedMessage = parseIRCMessage(event.data as string);

    // Check if there are bound listeners to this command.
    this.commandListeners.forEach(item => {
      if (item.command === parsedMessage.command) {
        // We have to pre-transform parameters to format, applicable
        // by specific listener.
        const transform = transformers[parsedMessage.command];

        item.listener(transform(parsedMessage));
      }
    });
  };

  public on: TListeningManipulator = (command, listener) => {
    this.commandListeners.push({ command, listener });
  };

  public off: TListeningManipulator = (command, listener) => {
    const foundIndex = this.commandListeners.findIndex(
      item => item.listener === listener && item.command === command,
    );

    if (foundIndex > -1) {
      this.commandListeners.splice(foundIndex, 1);
    }
  };
}
