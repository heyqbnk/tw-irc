import { ESignal } from '../../../../types';
import { IParsedIRCMessage } from '../../../../utils';

import { hostTransformer } from '../host';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('hostTransformer', () => {
        it('should return object with fields hostingChannel, viewersCount, ' +
          'raw if targetChannel is "-"', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: '- 133',
            raw: 'raw',
          });

          expect(hostTransformer('', message)).toEqual({
            hostingChannel: 'justintv',
            viewersCount: 133,
            raw: message.raw,
          });
        });

        it('should return object with fields hostingChannel, viewersCount, ' +
          'raw, targetChannel if targetChannel is NOT "-"', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'cooler 133',
            raw: 'raw',
          });

          expect(hostTransformer('', message)).toEqual({
            hostingChannel: 'justintv',
            targetChannel: 'cooler',
            viewersCount: 133,
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
