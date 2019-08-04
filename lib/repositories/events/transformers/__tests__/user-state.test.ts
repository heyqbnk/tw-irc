import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { userStateTransformer } from '../user-state';

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
