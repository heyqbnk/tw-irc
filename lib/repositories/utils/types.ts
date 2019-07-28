import {
  TCommandParams,
  TExecutableCommands,
} from '../../types/command-params';

type TCommandHandler<Command extends TExecutableCommands> = (
  send: (message: string) => void,
  params: TCommandParams[Command],
) => void;

type TCommandHandlersMap = {
  [Command in TExecutableCommands]: TCommandHandler<Command>;
};

export { TCommandHandlersMap, TCommandHandler };
