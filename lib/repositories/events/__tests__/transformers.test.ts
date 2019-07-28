/// <reference types="jest" />
import { EIRCCommand } from '../../../types/irc';
import { transformers } from '../transformers';
import { IParsedIRCMessage } from '../../../utils';

const defaultTransformerCommands = [
  EIRCCommand.JoinChannel,
  EIRCCommand.LeaveChannel,
];

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('transformers map', () => {
        it(
          `${defaultTransformerCommands.join(', ')} should return an ` +
            'object { channel: string, user: string }',
          () => {
            const message = getMessage();

            defaultTransformerCommands.forEach(command => {
              expect(transformers[command](message)).toEqual({
                channel: message.parameters[0].slice(1),
                user: message.prefix.user,
              });
            });
          },
        );

        it(
          `${EIRCCommand.Message} should return object with fields ` +
            '{ channel: message.parameters[0].slice(1), message: message.data, ' +
            'user: message.prefix.user, }',
          () => {
            const message = getMessage();

            expect(transformers[EIRCCommand.Message](message)).toEqual({
              channel: message.parameters[0].slice(1),
              message: message.data,
              user: message.prefix.user,
            });
          },
        );
      });
    });
  });
});

function getMessage(): IParsedIRCMessage {
  return {
    data: 'some data goes here',
    parameters: ['#justintv'],
    prefix: {
      user: 'justin',
    },
  } as IParsedIRCMessage;
}
