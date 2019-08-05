import { ESignal } from '../../../types';

/**
 * List of observable events.
 */
export type TObservableSignals =
  ESignal.ClearChat
  | ESignal.ClearMessage
  | ESignal.GlobalUserState
  | ESignal.Host
  | ESignal.Join
  | ESignal.Leave
  | ESignal.Message
  | ESignal.Notice
  | ESignal.Reconnect
  | ESignal.RoomState
  | ESignal.UserNotice
  | ESignal.UserState;
