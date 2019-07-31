import { TExecutableCommands } from './executable';
import { TCommandParams } from './params';

/**
 * Implementation for UtilsRepository class.
 */
export interface IUtilsRepository {
  /**
   * Sends raw message by socket.
   * @param {string} message
   */
  sendRawMessage(message: string): void;

  /**
   * Sends command by socket.
   * @param {Command} command
   * @param {TCommandParams[Command]} params
   */
  sendCommand<Command extends TExecutableCommands>(
    command: Command,
    params: TCommandParams[Command],
  ): void;
}
