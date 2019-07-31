import { commandHandlersMap } from './handlers';
import { Socket } from '../../socket';
import { IUtilsRepository, TCommandParams, TExecutableCommands } from './types';

export class UtilsRepository implements IUtilsRepository {
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    this.socket = socket;
  }

  public sendRawMessage = (message: string) => this.socket.send(message);

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
