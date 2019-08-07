import { Client } from '../client';
import * as utils from '../utils';
import { ESignal } from '../../types';
import { mockWebSocket } from '../../__mocks__/websocket';
import * as socket from '../../socket';

mockWebSocket();

describe('client', () => {
  describe('Client', () => {
    describe('constructor', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should generate random auth data, if it is not passed', () => {
        const generateSpy = jest.spyOn(utils, 'generateRandomAuth');
        new Client();

        expect(generateSpy).toHaveBeenCalledTimes(1);
      });

      it('should throw an error in case, password is invalid', () => {
        const auth = {
          login: 'husky',
          password: 'woof!',
        };
        expect(() => new Client({ auth })).toThrow();
      });

      it('should create socket with passed auth, if it is valid', () => {
        const auth = {
          login: 'HUSKY',
          password: 'oauth:CRUSH',
        };
        // @ts-ignore
        const socketSpy = jest.spyOn(socket, 'Socket');
        new Client({ auth });

        expect(socketSpy).toHaveBeenCalledWith(expect.objectContaining({
          auth,
        }));
      });
    });

    it('"connect" calls socket.connect()', () => {
      const client = new Client();
      const spy = jest.spyOn(client.socket, 'connect');
      client.connect();

      expect(spy).toHaveBeenCalledWith();
    });

    it('"disconnect" calls socket.disconnect()', () => {
      const client = new Client();
      const spy = jest.spyOn(client.socket, 'disconnect');
      client.disconnect();

      expect(spy).toHaveBeenCalledWith();
    });

    it('"on" calls events.on()', () => {
      const client = new Client();
      const spy = jest.spyOn((client as any).events, 'on');
      const command = ESignal.Join;
      const listener = jest.fn();
      client.on(command, listener);

      expect(spy).toHaveBeenCalledWith(command, listener);
    });

    it('"off" calls events.off()', () => {
      const client = new Client();
      const spy = jest.spyOn((client as any).events, 'off');
      const command = ESignal.Join;
      const listener = jest.fn();
      client.off(command, listener);

      expect(spy).toHaveBeenCalledWith(command, listener);
    });

    it('"assignChannel" should call channels.assign', () => {
      const client = new Client();
      const channel = 'some channel';
      const spy = jest.spyOn(client.channels, 'assign');
      client.assignChannel(channel);

      expect(spy).toBeCalledWith(channel);
    });

    it('"assignRoom" should call rooms.assign', () => {
      const client = new Client();
      const room = { channelId: '123', roomUuid: '2312' };
      const spy = jest.spyOn(client.rooms, 'assign');
      client.assignRoom(room);

      expect(spy).toBeCalledWith(room);
    });
  });
});
