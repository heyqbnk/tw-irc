import {ESignal, IPrefix} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {messageTransformer} from '../message';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('messageTransformer', () => {
        it('should return object with fields channel, message, author, ' +
          'raw and isSelf', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            prefix: {
              user: 'justin',
            } as IPrefix,
            meta: {
              badges: [],
              emotes: [],
              flags: [],
              tmiSentTs: 1,
            },
            raw: 'raw',
          });
          const {tmiSentTs, ...meta} = message.meta;

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
          const {tmiSentTs, ...meta} = message.meta;

          expect(messageTransformer(message.prefix.user, message)).toEqual({
            ...meta,
            channel: 'justintv',
            message: message.data,
            author: message.prefix.user,
            timestamp: tmiSentTs,
            flags: [],
            isSelf: true,
            raw: message.raw,
          });
        });

        it('should return field room: { channelId: string, roomUuid: string } ' +
          'if first parameter is "#chatrooms"', () => {
          const message = getMessage({
            parameters: ['#chatrooms'],
            data: '1:2',
          });

          expect(messageTransformer('', message)).toEqual(expect.objectContaining({
            room: {
              channelId: '1',
              roomUuid: '2',
            },
          }));
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
