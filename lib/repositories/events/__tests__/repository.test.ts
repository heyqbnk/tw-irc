/// <reference types="jest" />
import * as utils from '../../../utils';
import { EventsRepository } from '../repository';
import { Socket } from '../../../socket';
import { EIRCCommand } from '../../../types';

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('repository', () => {
        it(
          'Should bind listener on "message" event to socket when ' +
          'repo is being initialized',
          () => {
            const socket = mkSocket();
            const onSpy = jest.spyOn(socket, 'on');
            const repo = new EventsRepository(socket);

            expect(onSpy).toHaveBeenCalledWith(
              'message',
              (repo as any).onMessage,
            );
          },
        );

        it(
          'Should parse message, when there is some message came from' +
          'socket connection',
          () => {
            const parseSpy = jest.spyOn(utils, 'parseIRCMessage');
            const socket = mkSocket();
            const message = ':jtv!jtv@jtv.tmi.js 999 :Some message';

            new EventsRepository(socket);

            const ev = new MessageEvent('message', {
              data: message,
            });
            socket.connect();
            emitEvent(socket, ev);

            expect(parseSpy).toHaveBeenCalledWith(message);
          },
        );

        it(
          'Should call listeners associated with command if message command ' +
          'is equal to theirs',
          () => {
            const socket = mkSocket();
            const repo = new EventsRepository(socket);
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
            socket.connect();
            repo.on(EIRCCommand.Message, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalledWith({
              channel,
              message,
              user,
              userInfo: null,
            });
          },
        );

        it(
          'Should not call any listeners in case message command doesn\'t ' +
          'compare with theirs',
          () => {
            const socket = mkSocket();
            const repo = new EventsRepository(socket);
            const rawMessage = 'PING :some-host.com';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(EIRCCommand.Message, listener);
            emitEvent(socket, ev);

            expect(listener).not.toHaveBeenCalled();
          },
        );

        describe('off', () => {
          it('Should unbind existing listener', () => {
            const socket = mkSocket();
            const repo = new EventsRepository(socket);
            const rawMessage = ':qbnk!qbnk@qbnk JOIN #summit1g';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(EIRCCommand.JoinChannel, listener);
            emitEvent(socket, ev);

            repo.off(EIRCCommand.JoinChannel, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalledTimes(1);
          });

          it('Should not do anything if listener was not found', () => {
            const socket = mkSocket();
            const repo = new EventsRepository(socket);
            const rawMessage = ':qbnk!qbnk@qbnk JOIN #summit1g';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(EIRCCommand.JoinChannel, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalled();

            repo.off(EIRCCommand.Message, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
  });
});

function mkSocket() {
  return new Socket({ secure: false });
}

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}
