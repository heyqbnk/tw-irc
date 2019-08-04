import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { clearMessageTransformer } from '../clear-message';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('clearMessageTransformer', () => {
        it('should return object with fields channel, targetMessageId, ' +
          'message, messageAuthor, raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            meta: {
              targetMsgId: 1,
              login: 'somelogin',
            },
            raw: 'raw',
          });

          expect(clearMessageTransformer('', message)).toEqual({
            channel: 'justintv',
            targetMessageId: message.meta.targetMsgId,
            message: message.data,
            messageAuthor: message.meta.login,
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
