import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { clearChatTransformer } from '../clear-chat';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('clearChatTransformer', () => {
        it('should return object with fields channel, bannedUser, ' +
          'banDuration, bannedUserId, roomId, timestamp, raw if there is ' +
          'targetUserId on meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'bull',
            meta: {
              roomId: 1,
              tmiSentTs: 10,
              targetUserId: 100,
            },
            raw: 'raw',
          });

          expect(clearChatTransformer('', message)).toEqual({
            channel: 'justintv',
            bannedUser: 'bull',
            banDuration: Number.POSITIVE_INFINITY,
            bannedUserId: 100,
            roomId: 1,
            timestamp: 10,
            raw: 'raw',
          });
        });

        it('should take banDuration if it exists in meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'bull',
            meta: {
              roomId: 1,
              tmiSentTs: 10,
              targetUserId: 100,
              banDuration: 1000
            },
            raw: 'raw',
          });

          expect(clearChatTransformer('', message)).toEqual({
            channel: 'justintv',
            bannedUser: 'bull',
            banDuration: 1000,
            bannedUserId: 100,
            roomId: 1,
            timestamp: 10,
            raw: 'raw',
          });
        });

        it('should return object with fields channel, roomId, timestamp, ' +
          'raw if there is NO targetUserId on meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              roomId: 1,
              tmiSentTs: 10,
            },
            raw: 'raw',
          });

          expect(clearChatTransformer('', message)).toEqual({
            channel: 'justintv',
            roomId: 1,
            timestamp: 10,
            raw: 'raw',
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
