import { EIRCCommand } from '../../../types';

/**
 * List of observable events.
 */
export type TObservableEvents = EIRCCommand.Message
  | EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel;
