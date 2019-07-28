/// <reference types="jest" />
import * as utils from '../../../utils';
import { EventsRepository } from '../repository';
import { EIRCCommand } from '../../../types/irc';

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('repository', () => {
        it(
          'Should bind listener on "message" event to socket when ' +
            'repo is being initialized',
          () => {
            const ws = mkWebSocket();
            const addListenerSpy = jest.spyOn(ws, 'addEventListener');
            const repo = new EventsRepository(ws);

            expect(repo.socket).toBe(ws);
            expect(addListenerSpy).toHaveBeenCalledWith(
              'message',
              expect.anything(),
            );
          },
        );

        it(
          'Should parse message, when there is some message came from web' +
            'socket connection',
          () => {
            const parseSpy = jest.spyOn(utils, 'parseIRCMessage');
            const repo = new EventsRepository(mkWebSocket());
            const message = ':jtv!jtv@jtv.tmi.js 999 :Some message';

            const ev = new MessageEvent('message', {
              data: message,
            });
            repo.socket.dispatchEvent(ev);

            expect(parseSpy).toHaveBeenCalledWith(message);
          },
        );

        it(
          'Should call listeners associated with command if message command ' +
            'is equal to theirs',
          () => {
            const repo = new EventsRepository(mkWebSocket());
            const channel = 'justintv';
            const message = 'Some message';
            const user = 'jtv';
            const host = `${user}.tmi.js`;
            const rawMessage =
              `:${user}!${user}@${host} ${EIRCCommand.Message} ` +
              `#${channel} :${message}`;
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            repo.on(EIRCCommand.Message, listener);
            repo.socket.dispatchEvent(ev);

            expect(listener).toHaveBeenCalledWith({
              channel,
              message,
              user,
              userInfo: null,
            });
          },
        );

        it(
          "Should not call any listeners in case message command doesn't " +
            'compare with theirs',
          () => {
            const repo = new EventsRepository(mkWebSocket());
            const rawMessage = 'PING :some-host.com';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            repo.on(EIRCCommand.Message, listener);
            repo.socket.dispatchEvent(ev);

            expect(listener).not.toHaveBeenCalled();
          },
        );
      });
    });
  });
});

function mkWebSocket() {
  return new WebSocket('ws://localhost');
}
