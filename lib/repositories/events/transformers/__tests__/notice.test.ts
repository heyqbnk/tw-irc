import { ESignal, IPrefix } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { messageTransformer } from '../message';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('messageTransformer', () => {
        it('should return object with fields channel, message, author, ' +
          'raw and isSelft', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            prefix: {
              user: 'justin',
            } as IPrefix,
            meta: {
              badges: [],
              emotes: [],
              tmiSentTs: 1,
            },
            raw: 'raw',
          });
          const { tmiSentTs, ...meta } = message.meta;

          expect(messageTransformer('', message)).toEqual({
            ...meta,
            channel: 'justintv',
            message: message.data,
            author: message.prefix.user,
            timestamp: tmiSentTs,
            isSelf: false,
            raw: message.raw,
          });
        });

        it('should set isSelf = true if login is equal to author', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            prefix: {
              user: 'justin',
            } as IPrefix,
            meta: {
              badges: [],
              emotes: [],
              tmiSentTs: 1,
            },
            raw: 'raw',
          });
          const { tmiSentTs, ...meta } = message.meta;

          expect(messageTransformer(message.prefix.user, message)).toEqual({
            ...meta,
            channel: 'justintv',
            message: message.data,
            author: message.prefix.user,
            timestamp: tmiSentTs,
            isSelf: true,
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
