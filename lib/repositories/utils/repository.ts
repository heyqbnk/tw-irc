import {
  TCommandParams,
  TExecutableCommands,
} from '../../types/command-params';

import { commandHandlersMap } from './handlers';

export class UtilsRepository {
  public constructor(socket: WebSocket) {
    this.sendRawMessage = socket.send.bind(socket);
  }

  /**
   * Sends raw message.
   */
  public sendRawMessage: (message: string) => void;

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
