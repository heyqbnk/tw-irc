import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { noticeTransformer } from '../notice';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('noticeTransformer', () => {
        it('should return object with fields channel, message and raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            meta: null,
            raw: 'raw',
          });

          expect(noticeTransformer('', message)).toEqual({
            channel: 'justintv',
            message: message.data,
            raw: message.raw,
          });
        });

        it('should return object with fields channel, messageId, ' +
          'message and raw in case meta.msgId exists', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            meta: {
              msgId: 1,
            },
            raw: 'raw',
          });

          expect(noticeTransformer('', message)).toEqual({
            channel: 'justintv',
            message: message.data,
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
