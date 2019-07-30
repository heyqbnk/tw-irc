import { ICommandListener, TCallbacksMap } from './types';
import { parseIRCMessage } from '../../utils';
import { transformers } from './transformers';
import { TObservableEvents } from '../../types';
import { Socket } from '../../socket';

export class EventsRepository {
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

  /**
   * Binds event listener for command.
   * @param {Command} command
   * @param {TCallbacksMap[Command]} listener
   */
  public on = <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => this.commandListeners.push({ command, listener });

  /**
   * Removes command listener.
   * @param command
   * @param {Listener} listener
   */
  public off = <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => {
    const foundIndex = this.commandListeners.findIndex(
      item => item.listener === listener && item.command === command,
    );

    if (foundIndex > -1) {
      this.commandListeners.splice(foundIndex, 1);
    }
  };
}
