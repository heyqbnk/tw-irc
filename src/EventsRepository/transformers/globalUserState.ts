import {IGlobalUserStateMessage} from '../types';
import {IBadges, IMeta, IParsedMessage} from '../../types';

function globalUserState(message: IParsedMessage): IGlobalUserStateMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    badgeInfo: meta.badgeInfo as IBadges | null,
    badges: meta.badges as IBadges | null,
    color: meta.color as string | null,
    displayName: meta.displayName as string | null,
    emoteSets: meta.emoteSets as number[],
    userId: meta.userId as string | null,
  };
}

export default globalUserState;
