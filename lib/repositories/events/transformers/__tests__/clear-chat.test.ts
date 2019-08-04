/// <reference types="jest" />
import { ESignal } from '../../../../types';
import { transformers } from '..';
import { IParsedIRCMessage } from '../../../../utils';

import { clearChatTransformer } from '../clear-chat';
// import { clearMessageTransformer } from '../clear-message';
// import { globalUserStateTransformer } from '../global-user-state';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('clearChatTransformer', () => {
        // it('should return object with fields channel, bannedUser, ' +
        //   'banDuration, bannedUserId, roomId, timestamp, raw', () => {
        //   const message = getMessage({
        //     parameters: ['#justin'],
        //     data: 'bull'
        //   });
        //   expect(clearChatTransformer()).toEqual({
        //     channel: 'justin',
        //     bannedUser: 'bull',
        //   });
        // });

        it('should return object with fields channel, roomId, timestamp, ' +
          'raw if there is not targetUserId on meta', () => {
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
