import {IPrivateMessage} from '../types';
import {IBadges, IEmotes, IMeta, IParsedMessage} from '../../types';

function message(message: IParsedMessage): IPrivateMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    channel: message.channel,
    badgeInfo: meta.badgeInfo as IBadges | null,
    badges: meta.badges as IBadges | null,
    color: meta.color as string | null,
    displayName: meta.displayName as string | null,
    emotes: meta.emotes as IEmotes,
    id: meta.id as string,
    roomId: meta.roomId as number,
    tmiSentTs: meta.tmiSentTs as number,
    userId: meta.userId as string,
    message: message.message,
    bits: meta.bits ? meta.bits as number : null,
  };
}

export default message;
