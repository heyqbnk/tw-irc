import {ESignal} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {userNoticeTransformer} from '../user-notice';
import {EUserNoticeMessageId} from '../../types';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('userNoticeTransformer', () => {
        it('should return object with fields channel, message, messageId, ' +
          'timestamp, systemMessageId, raw and other meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              badges: [],
              emotes: [],
              tmiSentTs: 1,
              systemMsg: 10,
              message: 'Hey booooi!',
              msgId: EUserNoticeMessageId.AnonymousRewardGift,
            },
            data: null,
            raw: 'raw',
          });
          const {tmiSentTs, ...meta} = message.meta;

          expect(userNoticeTransformer('', message)).toEqual({
            ...meta,
            channel: 'justintv',
            flags: [],
            timestamp: tmiSentTs,
            raw: message.raw,
          });
        });
      });
    });
  });
});

function getMessage(
  props: Partial<IParsedIRCMessage> = {},
): IParsedIRCMessage {
  const {
    data = 'some data goes here',
    parameters = ['#justintv'],
    prefix = {
      user: 'justin',
    },
    signal = ESignal.Message,
    raw = '',
    meta = {},
  } = props;

  return {
    data,
    parameters,
    prefix,
    signal,
    raw,
    meta,
  } as IParsedIRCMessage;
}
