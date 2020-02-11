import {INoticeMessage} from '../types';
import {IMeta, IParsedMessage, ENoticeMessageId} from '../../types';

function notice(message: IParsedMessage): INoticeMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    channel: message.channel as string,
    message: message.message as string,
    msgId: meta.msgId as ENoticeMessageId,
  };
}

export default notice;
