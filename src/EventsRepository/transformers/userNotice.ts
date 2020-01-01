import {TUserNoticeMessage} from '../types';
import {
  IBadges,
  IEmotes,
  IMeta,
  IParsedMessage,
  EUserNoticeMessageId,
} from '../../types';

function userNotice(message: IParsedMessage): TUserNoticeMessage<any> {
  const meta = message.meta as IMeta;
  const mixin = Object
    .entries(message.meta)
    .reduce<Record<string, any>>((acc, [key, value]) => {
      if (key.startsWith('msgParam')) {
        if (!('params' in acc)) {
          acc.params = {};
        }
        const cut = key.replace('msgParam', '');
        acc.params[cut[0].toLowerCase() + cut.slice(1)] = value;
      }
      return acc;
    }, {});

  return {
    parsedMessage: message,
    channel: message.channel,
    badgeInfo: meta.badgeInfo as IBadges | null,
    badges: meta.badges as IBadges | null,
    color: meta.color as string | null,
    displayName: meta.displayName as string | null,
    emotes: meta.emotes as IEmotes,
    id: meta.id as string,
    login: meta.login as string,
    message: message.message,
    msgId: meta.msgId as EUserNoticeMessageId,
    roomId: meta.id as number,
    systemMsg: meta.systemMsg as string,
    tmiSentTs: meta.id as number,
    userId: meta.id as string,
    ...mixin,
  };
}

export default userNotice;
