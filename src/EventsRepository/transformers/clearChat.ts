import {IClearChatMessage} from '../types';
import {IParsedMessage} from '../../types';

function clearChat(message: IParsedMessage): IClearChatMessage {
  return {
    parsedMessage: message,
    channel: message.channel,
    banDuration: message.meta
      ? message.meta.banDuration as number
      : Number.POSITIVE_INFINITY,
    user: message.message,
  };
}

export default clearChat;
