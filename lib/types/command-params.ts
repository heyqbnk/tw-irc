import { EIRCCommand } from './irc';

interface ICommandDefaultParams {
  channel: string;
}

interface IMessageCommandParams extends ICommandDefaultParams {
  message: string;
}

type TExecutableCommands =
  | EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel
  | EIRCCommand.Message;

interface ICommandParams {
  [EIRCCommand.JoinChannel]: ICommandDefaultParams;
  [EIRCCommand.LeaveChannel]: ICommandDefaultParams;
  [EIRCCommand.Message]: IMessageCommandParams;
}

type TCommandParams = {
  [Command in TExecutableCommands]: ICommandParams[Command];
};

export { TCommandParams, TExecutableCommands };
