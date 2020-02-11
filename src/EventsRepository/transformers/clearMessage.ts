import {IClearMsgMessage} from '../types';
import {IMeta, IParsedMessage} from '../../types';

function clearMessage(message: IParsedMessage): IClearMsgMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    channel: message.channel as string,
    login: meta.login as string,
    message: message.message as string,
    targetMsgId: meta.targetMsgId as string,
  };
}

export default clearMessage;
