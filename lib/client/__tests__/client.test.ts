import { Client } from '../client';
import { generateRandomLogin } from '../utils';
import { EIRCCommand } from '../../types';
import { Socket } from '../../socket';

jest.mock('../utils');

describe('client', () => {
  describe('Client', () => {
    it('if auth data is not stated, sets default random data. Otherwise set ' +
      'stated', () => {
      new Client();

      expect(generateRandomLogin).toHaveBeenCalledTimes(2);

      const auth = {
        login: 'fan',
        password: 'boy',
      };
      const client = new Client({ auth });
      expect((client as any).auth).toEqual(auth);
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
        password: 'white',
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

    it('when message is received, in case it is PING command, respond with ' +
      'PONG. Otherwise, ignore', () => {
      const client = new Client();
      client.connect();

      const sendSpy = jest.spyOn(client.utils, 'sendRawMessage')
        .mockImplementation(() => {
        });
      const messageEvent = new MessageEvent('message', {
        data: 'PING :tmi.twitch.tv',
      });
      emitEvent(client.socket, messageEvent);

      expect(sendSpy).toHaveBeenCalledWith(EIRCCommand.Pong);
      sendSpy.mockReset();

      const anotherMessage = new MessageEvent('message', {
        data: ':qbnk!qbnk@qbnk JOIN #qbnk',
      });
      emitEvent(client.socket, anotherMessage);

      expect(sendSpy).not.toHaveBeenCalled();
    });
  });
});

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}
