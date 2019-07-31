import { EIRCCommand } from '../../../types';
import { TExecutableCommands } from './executable';

interface ICommandDefaultParams {
  channel: string;
}

interface IMessageCommandParams extends ICommandDefaultParams {
  message: string;
}

interface ICommandParams {
  [EIRCCommand.JoinChannel]: ICommandDefaultParams;
  [EIRCCommand.LeaveChannel]: ICommandDefaultParams;
  [EIRCCommand.Message]: IMessageCommandParams;
}

export type TCommandParams = {
  [Command in TExecutableCommands]: ICommandParams[Command];
};
