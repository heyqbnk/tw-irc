import { ESignal } from '../../../types';

/**
 * List of executable singals.
 */
export type TExecutableSignals = ESignal.Join
  | ESignal.Leave
  | ESignal.Message;
