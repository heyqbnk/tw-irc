import { TExecutableSignals } from './executable';
import { IExecuteSignalParamsMap } from './params';

/**
 * Implementation for UtilsRepository class.
 */
export interface IUtilsRepository {
  /**
   * Sends signals by socket.
   * @param {Signal} command
   * @param {IExecuteSignalParams[Signal]} params
   */
  sendSignal<Signal extends TExecutableSignals>(
    command: Signal,
    params: IExecuteSignalParamsMap[Signal],
  ): void;
}
