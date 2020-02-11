import {IUserStateMessage} from '../types';
import {IBadges, IMeta, IParsedMessage} from '../../types';

function userState(message: IParsedMessage): IUserStateMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    channel: message.channel as string,
    badgeInfo: meta.badgeInfo as IBadges | null,
    badges: meta.badges as IBadges | null,
    color: meta.color as string | null,
    displayName: meta.displayName as string,
    emoteSets: meta.emoteSets as number[],
  };
}

export default userState;
