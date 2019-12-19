import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { userNoticeTransformer } from '../user-notice';

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
              msgId: 100,
            },
            data: 'Woop',
            raw: 'raw',
          });
          const {
            tmiSentTs,
            msgId,
            systemMsg,
            ...meta
          } = message.meta;

          expect(userNoticeTransformer('', message)).toEqual({
            ...meta,
            channel: 'justintv',
            message: message.data,
            flags: [],
            messageId: msgId,
            timestamp: tmiSentTs,
            systemMessageId: systemMsg,
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
