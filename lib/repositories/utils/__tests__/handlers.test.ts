/// <reference types="jest"/>
import { compile, commandHandlersMap } from '../handlers';
import { ESignal } from '../../../types';

describe('repositories', () => {
  describe('utils', () => {
    describe('handlers', () => {
      describe('compile', () => {
        it('Should return text, with channel, message and command separated ' +
          'with spaces', () => {
          const command = ESignal.Join;
          const channel = 'summit1g';
          const message = 'some message from user';

          expect(compile({ command, channel, message }))
            .toBe(`${command} #${channel} ${message}`);
        });

        it('Should contain a channel name with hashtag', () => {
          const command = ESignal.Join;
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
          const command = ESignal.Join;
          const message = 'some message from user';

          expect(compile({ command, message })).toBe(`${command} ${message}`);
        });
      });

      describe('commandHandlersMap', () => {
        it('For command Join should call "send" method, with ' +
          'text: ESignal.Join + " #" + channel', () => {
          const handler = commandHandlersMap[ESignal.Join];
          const send = jest.fn(message => message);
          const channel = 'summit1g';

          handler(send, { channel });
          expect(send).toBeCalledWith(`${ESignal.Join} #${channel}`);
        });

        it('For command Leave should call "send" method, with ' +
          'text: ESignal.Leave + " #" + channel', () => {
          const handler = commandHandlersMap[ESignal.Leave];
          const send = jest.fn(message => message);
          const channel = 'summit1g';

          handler(send, { channel });
          expect(send).toBeCalledWith(`${ESignal.Leave} #${channel}`);
        });

        it('For command Message should call "send" method, with ' +
          'text: ESignal.Message + " #" + channel + " :" + message', () => {
          const handler = commandHandlersMap[ESignal.Message];
          const send = jest.fn(message => message);
          const channel = 'summit1g';
          const message = 'Hello Alice!';

          handler(send, { channel, message });
          expect(send).toBeCalledWith(`${ESignal.Message} #${channel} :${message}`);
        });
      });
    });
  });
});
