import { EIRCCommand } from '../../../types';

/**
 * List of executable commands.
 */
export type TExecutableCommands = EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel
  | EIRCCommand.Message;
