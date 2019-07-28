/// <reference types="jest" />
import { getChannel } from '../utils';
import { IParsedIRCMessage } from '../../../utils';

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('getChannel', () => {
        it(
          'Should return string, equal to first ' +
            'parameters of parsed message without first letter',
          () => {
            const message = {
              parameters: ['#justintv'],
            } as IParsedIRCMessage;

            expect(getChannel(message)).toEqual(message.parameters[0].slice(1));
          },
        );
      });
    });
  });
});
