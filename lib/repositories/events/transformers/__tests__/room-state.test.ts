import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { noticeTransformer } from '../notice';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('noticeTransformer', () => {
        it('should return object with fields messageId, channel and raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              msgId: 1,
            },
            raw: 'raw',
          });

          expect(noticeTransformer('', message)).toEqual({
            channel: 'justintv',
            messageId: message.meta.msgId,
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
