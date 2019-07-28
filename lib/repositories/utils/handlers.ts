import { TCommandHandlersMap } from './types';
import { EIRCCommand } from '../../types/irc';

interface ICompileParams {
  command: EIRCCommand;
  channel?: string;
  message?: string;
}

const { JoinChannel, LeaveChannel, Message } = EIRCCommand;

/**
 * Compiles command to message.
 * @param {ICompileParams} params
 * @returns {string}
 */
function compile(params: ICompileParams) {
  const { command, channel, message } = params;
  const partials: string[] = [command];

  if (channel) {
    partials.push(`#${channel}`);
  }
  if (message) {
    partials.push(message);
  }

  return partials.join(' ');
}

const commandHandlersMap: TCommandHandlersMap = {
  [JoinChannel]: (send, { channel }) =>
    send(compile({ command: JoinChannel, channel })),
  [LeaveChannel]: (send, { channel }) =>
    send(compile({ command: LeaveChannel, channel })),
  [Message]: (send, { message, channel }) =>
    send(`${Message} #${channel} :${message}`),
};

export { commandHandlersMap };
