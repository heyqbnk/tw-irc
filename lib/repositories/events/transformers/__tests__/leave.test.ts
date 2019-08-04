import { ESignal, IPrefix } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { joinTransformer } from '../join';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('joinTransformer', () => {
        it('should return object with fields channel, joinedUser, isSelf ' +
          'and raw', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            prefix: {
              user: 'shaker'
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
              user: 'shaker'
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
