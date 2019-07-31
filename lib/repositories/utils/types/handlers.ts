import { TExecutableCommands } from './executable';
import { TCommandParams } from './params';

type TCommandHandler<Command extends TExecutableCommands> = (
  send: (message: string) => void,
  params: TCommandParams[Command],
) => void;

export type TCommandHandlersMap = {
  [Command in TExecutableCommands]: TCommandHandler<Command>;
};
