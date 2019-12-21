import * as utils from '../../utils';
import EventsRepository from '../EventsRepository';
import Socket from '../../Socket';
import {ESignal} from '../../types';
import {mockWebSocket} from '../../__mocks__/websocket';
import {mkSocket} from '../../__mocks__/socket';

mockWebSocket();

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('repository', () => {
        it('should bind listener on "message" event to socket when ' +
          'repo is being initialized', () => {
            const socket = mkSocket();
            const onSpy = jest.spyOn(socket, 'on');
            const repo = mkEventsRepository({socket});

            expect(onSpy).toHaveBeenCalledWith(
              'message',
              (repo as any).onMessage,
            );
          },
        );

        it('should parse message, when there is some message came from socket ' +
          'connection', () => {
            const parseSpy = jest.spyOn(utils, 'parseIRCMessage');
            const socket = mkSocket();
            const message = ':jtv!jtv@jtv.tmi.js 999 :Some message';

            mkEventsRepository();

            const ev = new MessageEvent('message', {
              data: message,
            });
            socket.connect();
            emitEvent(socket, ev);

            expect(parseSpy).toHaveBeenCalledWith(message);
          },
        );

        it('should call listeners associated with command if message command ' +
          'is equal to theirs', () => {
            const socket = mkSocket();
            const repo = mkEventsRepository({socket});
            const channel = 'justintv';
            const message = 'Some message';
            const user = 'jtv';
            const host = `${user}.tmi.js`;
            const rawMessage =
              `user-id=1 :${user}!${user}@${host} ${ESignal.Message} ` +
              `#${channel} :${message}`;
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(ESignal.Message, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalled();
          },
        );

        it('should not call any listeners in case message command doesn\'t ' +
          'compare with theirs', () => {
            const socket = mkSocket();
            const repo = mkEventsRepository({socket});
            const rawMessage = 'PING :some-host.com';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(ESignal.Message, listener);
            emitEvent(socket, ev);

            expect(listener).not.toHaveBeenCalled();
          },
        );

        describe('off', () => {
          it('should unbind existing listener', () => {
            const socket = mkSocket();
            const repo = mkEventsRepository({socket});
            const rawMessage = ':qbnk!qbnk@qbnk JOIN #summit1g';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(ESignal.Join, listener);
            emitEvent(socket, ev);

            repo.off(ESignal.Join, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalledTimes(1);
          });

          it('should not do anything if listener was not found', () => {
            const socket = mkSocket();
            const repo = mkEventsRepository({socket});
            const rawMessage = ':qbnk!qbnk@qbnk JOIN #summit1g';
            const listener = jest.fn();

            const ev = new MessageEvent('message', {
              data: rawMessage,
            });
            socket.connect();
            repo.on(ESignal.Join, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalled();

            repo.off(ESignal.Message, listener);
            emitEvent(socket, ev);

            expect(listener).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
  });
});

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}

function mkEventsRepository(props: {socket?: Socket; login?: string} = {}) {
  const {
    socket = mkSocket(),
    login = '',
  } = props;

  return new EventsRepository(socket, login);
}
