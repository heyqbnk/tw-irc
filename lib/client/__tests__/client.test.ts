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

    it('"assignChannel" sets assignedChannel to passed value', () => {
      const client = new Client();
      const channel = 'some channel';
      client.assignChannel(channel);

      expect((client as any).assignedChannel).toBe(channel);
    });

    describe('say', () => {
      it('should throw an error, if a channel argument was not passed and ' +
        'channel was not bound to client.', () => {
        const client = new Client();
        expect(() => client.say('Hey!')).toThrow();
      });

      it('should call utils.sendSignal() if channel was passed, or was ' +
        'bound to client', () => {
        const client = new Client();
        const channel = 'woof!';
        const saidChannel = 'horror';
        const message = 'Woop-woop!';
        const spy = jest.spyOn(client.utils, 'sendSignal')
          .mockImplementation(jest.fn);

        client.say(message, saidChannel);
        expect(spy).toHaveBeenCalledWith(ESignal.Message, {
          channel: saidChannel,
          message,
        });

        client.assignChannel(channel);
        client.say(message);
        expect(spy).toHaveBeenCalledWith(ESignal.Message, {
          channel,
          message,
        });
      });
    });
  });
});
