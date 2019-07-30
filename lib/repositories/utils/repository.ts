import { TCommandParams, TExecutableCommands } from '../../types';

import { commandHandlersMap } from './handlers';
import { Socket } from '../../socket';

export class UtilsRepository {
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    this.socket = socket;
  }

  /**
   * Sends raw message.
   */
  public sendRawMessage = (message: string) => this.socket.send(message);

  /**
   * Sends IRC command.
   *
   * @param command
   * @param params
   */
  public sendCommand = <Command extends TExecutableCommands>(
    command: Command,
    params: TCommandParams[Command],
  ) => {
    const handleCommand = commandHandlersMap[command];

    // Code reliability is guaranteed if there are no TypeScript errors
    // previously.
    // @ts-ignore
    handleCommand(this.sendRawMessage, params);
  };
}
