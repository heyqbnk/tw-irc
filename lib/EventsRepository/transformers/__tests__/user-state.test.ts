import {ESignal} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {userStateTransformer} from '../user-state';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('userStateTransformer', () => {
        it('should return object with fields channel, raw and other meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              badges: [],
              emoteSets: [],
            },
            data: 'Woop',
            raw: 'raw',
          });

          expect(userStateTransformer('', message)).toEqual({
            ...message.meta,
            channel: 'justintv',
            raw: message.raw,
          });
        });

        it('should return field room: { channelId: string, roomUuid: string } ' +
          'if first parameter is "#chatrooms"', () => {
          const message = getMessage({
            parameters: ['#chatrooms'],
            data: '1:2',
          });

          expect(userStateTransformer('', message)).toEqual(expect.objectContaining({
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
