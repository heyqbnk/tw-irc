import { Client } from '../client';
import * as utils from '../utils';
import { EIRCCommand } from '../../types';
import { Socket } from '../../socket';
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
        const client = new Client();

        expect((client as any).auth).toEqual({
          login: expect.any(String),
          password: expect.any(String),
        });
        expect(generateSpy).toHaveBeenCalledTimes(1);
      });

      it('should warn user that his password is invalid and generate random ' +
        'auth data, in case, password is invalid', () => {
        const auth = {
          login: 'husky',
          password: 'woof!',
        };
        const generateSpy = jest.spyOn(utils, 'generateRandomAuth');
        const warnSpy = jest.spyOn(utils, 'warnInvalidPassword');
        const client = new Client({ auth });

        expect((client as any).auth).not.toEqual(auth);
        expect((client as any).auth).toEqual({
          login: expect.any(String),
          password: expect.any(String),
        });
        expect(generateSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('"connect" call socket.connect()', () => {
      const client = new Client();
      const spy = jest.spyOn(client.socket, 'connect');
      client.connect();

      expect(spy).toHaveBeenCalledWith();
    });

    it('"disconnect" call socket.disconnect()', () => {
      const client = new Client();
      const spy = jest.spyOn(client.socket, 'disconnect');
      client.disconnect();

      expect(spy).toHaveBeenCalledWith();
    });

    it('"on" method calls events.on', () => {
      const client = new Client();
      const spy = jest.spyOn((client as any).events, 'on');
      const command = EIRCCommand.JoinChannel;
      const listener = jest.fn();
      client.on(command, listener);

      expect(spy).toHaveBeenCalledWith(command, listener);
    });

    it('"off" method calls events.off', () => {
      const client = new Client();
      const spy = jest.spyOn((client as any).events, 'off');
      const command = EIRCCommand.JoinChannel;
      const listener = jest.fn();
      client.off(command, listener);

      expect(spy).toHaveBeenCalledWith(command, listener);
    });

    it('"bindChannel" sets boundChannel to stated value', () => {
      const client = new Client();
      const channel = 'some channel';
      client.bindChannel(channel);

      expect((client as any).boundChannel).toBe(channel);
    });

    it('"say" method throws an error, if a channel argument was not passed and ' +
      'channel was not bound to client. Otherwise, calls utils.sendCommand ' +
      'with parameters: EIRCommand.Message and { channel, message }', () => {
      const client = new Client();
      expect(() => client.say('Hey!')).toThrow();

      const channel = 'woof!';
      const saidChannel = 'horror';
      const message = 'Woop-woop!';
      client.bindChannel(channel);
      const spy = jest.spyOn(client.utils, 'sendCommand')
        .mockImplementation(() => {
        });

      client.say(message);
      expect(spy).toHaveBeenCalledWith(EIRCCommand.Message, {
        channel,
        message,
      });

      client.say(message, saidChannel);
      expect(spy).toHaveBeenCalledWith(EIRCCommand.Message, {
        channel: saidChannel,
        message,
      });
    });

    it('when socket is opened, request capabilities: "membership", "tags", ' +
      '"commands". Sends authentication data', () => {
      const auth = {
        login: 'husky',
        password: 'oauth:white',
      };
      const client = new Client({ auth });
      client.connect();
      const sendSpy = jest.spyOn(client.utils, 'sendRawMessage')
        .mockImplementation(() => {
        });
      const openEvent = new Event('open');
      emitEvent(client.socket, openEvent);

      const caps = ['membership', 'tags', 'commands'];
      caps.forEach(cap => {
        expect(sendSpy)
          .toHaveBeenCalledWith(`${EIRCCommand.CapabilityRequest} :twitch.tv/${cap}`);
      });

      expect(sendSpy)
        .toHaveBeenCalledWith(`${EIRCCommand.Password} ${auth.password}`);
      expect(sendSpy)
        .toHaveBeenCalledWith(`${EIRCCommand.Nickname} ${auth.login}`);
    });
  });
});

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}
