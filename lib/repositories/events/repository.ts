import { IListener, TCallbacksMap } from './types';
import { EIRCCommand } from '../../types/irc';
import { parseIRCMessage } from '../../utils';
import { transformers } from './transformers';
import { TObservableEvents } from '../../types/event-params';

const ircCommandsValues = Object.values(EIRCCommand);

export class EventsRepository {
  private readonly listeners: IListener[] = [];

  public constructor(socket: WebSocket) {
    this.socket = socket;
    this.socket.addEventListener('message', this.onMessage);
  }

  /**
   * Give access to socket events only in this repo.
   */
  public socket: WebSocket;

  /**
   * Binds event listener for command.
   * @param {Command} command
   * @param {TCallbacksMap[Command]} listener
   */
  public on = <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => this.listeners.push({ command, listener });

  /**
   * Parses incoming message and triggers event listeners.
   * @param {MessageEvent} event
   */
  private onMessage = (event: MessageEvent) => {
    const parsedMessage = parseIRCMessage(event.data as string);

    if (!ircCommandsValues.includes(parsedMessage.command)) {
      return;
    }
    // Check if there are bound listeners to this command.
    this.listeners.forEach(item => {
      if (item.command === parsedMessage.command) {
        // We have to pre-transform parameters to format, applicable
        // by specific listener.
        const transform = transformers[parsedMessage.command];

        item.listener(transform(parsedMessage));
      }
    });
  };
}
