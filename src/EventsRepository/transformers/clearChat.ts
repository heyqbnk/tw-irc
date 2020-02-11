import {IClearChatMessage} from '../types';
import {IParsedMessage} from '../../types';

function clearChat(message: IParsedMessage): IClearChatMessage {
  return {
    parsedMessage: message,
    channel: message.channel as string,
    banDuration: message.meta
      ? message.meta.banDuration as number
      : Number.POSITIVE_INFINITY,
    user: message.message as string,
  };
}

export default clearChat;
