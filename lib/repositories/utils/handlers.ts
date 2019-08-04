import { TExecuteSignalHandler, TExecuteSignalHandlersMap } from './types';
import { ESignal } from '../../types';

interface ICompileParams {
  command: ESignal;
  channel?: string;
  message?: string;
}

const { Join, Leave, Message } = ESignal;

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

/**
 * Handler for JOIN
 * @param {(message: string) => void} send
 * @param params
 */
const joinHandler: TExecuteSignalHandler<ESignal.Join> =
  (send, { channel }) => send(compile({ command: Join, channel }));

/**
 * Handler for PART
 * @param {(message: string) => void} send
 * @param params
 */
const leaveHandler: TExecuteSignalHandler<ESignal.Leave> =
  (send, { channel }) => send(compile({ command: Leave, channel }));

/**
 * Handler for PRIVMSG
 * @param {(message: string) => void} send
 * @param {IExecuteSignalParams[ESignal.Message]} params
 */
const messageHandler: TExecuteSignalHandler<ESignal.Message> =
  (send, { message, channel }) => {
    send(`${Message} #${channel} :${message}`);
  };

const commandHandlersMap: TExecuteSignalHandlersMap = {
  [Join]: joinHandler,
  [Leave]: leaveHandler,
  [Message]: messageHandler,
};

export { commandHandlersMap, compile };
