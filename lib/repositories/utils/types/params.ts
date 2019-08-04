import { ESignal } from '../../../types';
import { TExecutableSignals } from './executable';

interface ISignalExecuteDefaultParams {
  channel: string;
}

interface IMessageSignalExecuteParams extends ISignalExecuteDefaultParams {
  message: string;
}

interface IExecuteSignalParams {
  [ESignal.Join]: ISignalExecuteDefaultParams;
  [ESignal.Leave]: ISignalExecuteDefaultParams;
  [ESignal.Message]: IMessageSignalExecuteParams;
}

export type IExecuteSignalParamsMap = {
  [Signal in TExecutableSignals]: IExecuteSignalParams[Signal];
};
