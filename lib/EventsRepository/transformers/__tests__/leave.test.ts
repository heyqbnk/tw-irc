import {ESignal, IPrefix} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {leaveTransformer} from '../leave';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('leaveTransformer', () => {
        it('should return object with fields channel, leftUser, isSelf ' +
          'and raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            prefix: {
              user: 'shaker',
            } as IPrefix,
            raw: 'raw',
          });

          expect(leaveTransformer('', message)).toEqual({
            channel: 'justintv',
            leftUser: 'shaker',
            isSelf: false,
            raw: message.raw,
          });
        });

        it('should set isSelf = true if login is equal to leftUser', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            prefix: {
              user: 'shaker',
            } as IPrefix,
            raw: 'raw',
          });

          expect(leaveTransformer('shaker', message)).toEqual({
            channel: 'justintv',
            leftUser: 'shaker',
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
