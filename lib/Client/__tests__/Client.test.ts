import Client from '../Client';
import * as utils from '../utils';
import { ESignal } from '../../types';
import { mockWebSocket } from '../../__mocks__/websocket';

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
  });
});
