/// <reference types="jest" />
import {
  getChannel,
  joinChannelTransformer,
  messageTransformer,
} from '../utils';
import { IParsedIRCMessage } from '../../../utils';

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('getChannel', () => {
        it(
          'Should take first item of field "parameters" and return text ' +
          'starting from second letter',
          () => {
            const message = { parameters: ['#justintv'] } as IParsedIRCMessage;

            expect(getChannel(message)).toEqual(message.parameters[0].slice(1));
          },
        );
      });

      describe('joinChannelTransformer', () => {
        it(
          'Should return object with fields "channel" and "user" equal to ' +
          'message.prefix.user',
          () => {
            const message = {
              parameters: ['#justintv'],
              prefix: {
                user: 'justin',
              },
            } as IParsedIRCMessage;

            expect(joinChannelTransformer(message)).toEqual({
              channel: message.parameters[0].slice(1),
              user: message.prefix.user,
            });
          },
        );
      });

      describe('messageTransformer', () => {
        it(
          'Should return object with fields "channel", "user", "userInfo" and ' +
          'message',
          () => {
            const message = {
              parameters: ['#justintv'],
              meta: {},
              data: 'some message here',
              prefix: {
                user: 'justin',
              },
            } as IParsedIRCMessage;

            expect(messageTransformer(message)).toEqual({
              channel: message.parameters[0].slice(1),
              message: message.data,
              userInfo: message.meta,
              user: message.prefix.user,
            });
          },
        );
      });
    });
  });
});
