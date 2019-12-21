import {ESignal, IPrefix} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {joinTransformer} from '../join';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('joinTransformer', () => {
        it('should return object with fields channel, joinedUser, isSelf ' +
          'and raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            prefix: {
              user: 'shaker',
            } as IPrefix,
            raw: 'raw',
          });

          expect(joinTransformer('', message)).toEqual({
            channel: 'justintv',
            joinedUser: 'shaker',
            isSelf: false,
            raw: message.raw,
          });
        });

        it('should set isSelf = true if login is equal to joinedUser', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            prefix: {
              user: 'shaker',
            } as IPrefix,
            raw: 'raw',
          });

          expect(joinTransformer('shaker', message)).toEqual({
            channel: 'justintv',
            joinedUser: 'shaker',
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

          expect(joinTransformer('', message)).toEqual(expect.objectContaining({
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
