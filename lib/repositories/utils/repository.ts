import { commandHandlersMap } from './handlers';
import { Socket } from '../../socket';
import {
  IUtilsRepository,
  IExecuteSignalParamsMap,
  TExecutableSignals,
} from './types';

export class UtilsRepository implements IUtilsRepository {
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    this.socket = socket;
  }

  public sendSignal = <Signal extends TExecutableSignals>(
    command: Signal,
    params: IExecuteSignalParamsMap[Signal],
  ) => {
    const handleCommand = commandHandlersMap[command];

    // Code reliability is guaranteed if there are no TypeScript errors
    // previously.
    // @ts-ignore
    handleCommand(this.socket.send, params);
  };
}
