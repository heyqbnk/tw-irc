import transformers from '../transformers';
import {ESignal} from '../../../types';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('map', () => {
        it('"Reconnect" should return undefined', () => {
          expect((transformers[ESignal.Reconnect] as any)()).toBe(undefined);
        });
      });
    });
  });
});
