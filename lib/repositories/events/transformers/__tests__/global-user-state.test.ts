import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { globalUserStateTransformer } from '../global-user-state';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('globalUserStateTransformer', () => {
        it('should return object with fields raw and parsed meta', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            meta: {
              badges: [],
              emoteSets: [],
            },
            raw: 'raw',
          });

          expect(globalUserStateTransformer('', message)).toEqual({
            ...message.meta,
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
