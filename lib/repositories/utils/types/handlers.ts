import { TExecutableSignals } from './executable';
import { IExecuteSignalParamsMap } from './params';

export type TExecuteSignalHandler<Command extends TExecutableSignals> = (
  send: (message: string) => void,
  params: IExecuteSignalParamsMap[Command],
) => void;

export type TExecuteSignalHandlersMap = {
  [Signal in TExecutableSignals]: TExecuteSignalHandler<Signal>;
};
