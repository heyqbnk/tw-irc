/// <reference types="jest"/>
import { compile, commandHandlersMap } from '../handlers';
import { EIRCCommand } from '../../../types';

describe('repositories', () => {
  describe('utils', () => {
    describe('handlers', () => {
      describe('compile', () => {
        it('Should return text, with channel, message and command separated ' +
          'with spaces', () => {
          const command = EIRCCommand.JoinChannel;
          const channel = 'summit1g';
          const message = 'some message from user';

          expect(compile({ command, channel, message }))
            .toBe(`${command} #${channel} ${message}`);
        });

        it('Should contain a channel name with hashtag', () => {
          const command = EIRCCommand.JoinChannel;
          const channel = 'summit1g';
          const message = 'some message from user';

          expect(
            compile({
              command,
              channel,
              message,
            }),
          ).toContain('#' + channel);
        });

        it('Should not contain a channel if it is not stated', () => {
          const command = EIRCCommand.JoinChannel;
          const message = 'some message from user';

          expect(compile({ command, message })).toBe(`${command} ${message}`);
        });
      });

      describe('commandHandlersMap', () => {
        it('For command JoinChannel should call "send" method, with ' +
          'text: EIRCCommand.JoinChannel + " #" + channel', () => {
          const handler = commandHandlersMap[EIRCCommand.JoinChannel];
          const send = jest.fn(message => message);
          const channel = 'summit1g';

          expect(handler(send, { channel }))
            .toBe(`${EIRCCommand.JoinChannel} #${channel}`);
        });

        it('For command LeaveChannel should call "send" method, with ' +
          'text: EIRCCommand.LeaveChannel + " #" + channel', () => {
          const handler = commandHandlersMap[EIRCCommand.LeaveChannel];
          const send = jest.fn(message => message);
          const channel = 'summit1g';

          expect(handler(send, { channel }))
            .toBe(`${EIRCCommand.LeaveChannel} #${channel}`);
        });

        it('For command Message should call "send" method, with ' +
          'text: EIRCCommand.Message + " #" + channel + " :" + message', () => {
          const handler = commandHandlersMap[EIRCCommand.Message];
          const send = jest.fn(message => message);
          const channel = 'summit1g';
          const message = 'Hello Alice!';

          expect(handler(send, { channel, message }))
            .toBe(`${EIRCCommand.Message} #${channel} :${message}`);
        });
      });
    });
  });
});
