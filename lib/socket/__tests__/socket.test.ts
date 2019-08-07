import { Socket } from '../socket';
import { ESignal } from '../../types';
import { ESocketReadyState } from '../types';
import { mockWebSocket, MockWebSocket } from '../../__mocks__/websocket';
import { mkSocket } from '../../__mocks__/socket';

mockWebSocket();

describe('socket', () => {
  describe('constructor', () => {
    it('should remember authentication data with fields "login" and "password", ' +
      'taken from passed "auth". Each of this values should be lower-cased', () => {
      const auth = {
        login: 'Astronaunt',
        password: 'NUTS',
      };
      const socket = mkSocket({ auth });

      expect((socket as any).auth).toEqual({
        login: auth.login.toLowerCase(),
        password: auth.password.toLowerCase(),
      });
    });
  });

  describe('connect', () => {
    it('should create WebSocket instance with path ' +
      '"ws://irc-ws.chat.twitch.tv:80" if "secure" was "false", or ' +
      '"wss://irc-ws.chat.twitch.tv:443" if "secure" was "true"', () => {
      let socket = mkSocket({ secure: false });
      socket.connect();

      let ws = getSocket(socket);
      // Previously we have overridden WebSocket with MockWebSocket, so check it
      expect(ws).toBeInstanceOf(MockWebSocket);
      expect(MockWebSocket)
        .toHaveBeenLastCalledWith('ws://irc-ws.chat.twitch.tv:80');

      socket = mkSocket({ secure: true });
      socket.connect();
      expect(MockWebSocket)
        .toHaveBeenLastCalledWith('wss://irc-ws.chat.twitch.tv:443');
    });

    it('should close previous connection', () => {
      const socket = mkSocket();
      let ws = getSocket(socket);

      expect(ws).toBe(undefined);
      socket.connect();
      ws = getSocket(socket);
      const spy = jest.spyOn(ws, 'close');

      expect(ws).toBeInstanceOf(MockWebSocket);

      socket.connect();
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('disconnect', () => {
    it('should close previous connection', () => {
      const socket = mkSocket();

      socket.disconnect();
      socket.connect();
      const ws = getSocket(socket);
      const spy = jest.spyOn(ws, 'close');

      socket.disconnect();
      expect(spy).toHaveBeenCalledWith();
    });
  });

  it('"on" adds event listener in case websocket exists. Otherwise, ignore', () => {
    const socket = mkSocket();
    const listener = jest.fn();
    socket.on('message', () => {
    });

    socket.connect();
    const spy = jest.spyOn(getSocket(socket), 'addEventListener');
    socket.on('message', listener);

    expect(spy).toBeCalledWith('message', listener);
  });

  it('"off" should unbind existing listener. Otherwise ignore', () => {
    const socket = mkSocket();
    const spliceSpy = jest.spyOn((socket as any).listeners, 'splice');
    const listener = jest.fn();

    socket.off('message', () => {
    });
    expect(spliceSpy).not.toHaveBeenCalled();

    socket.on('message', listener);
    socket.off('message', listener);
    expect(spliceSpy).toHaveBeenCalled();
  });

  it('"getReadyState" returns socket connection ready state if socket ' +
    'exists. Otherwise returns ESocketReadyState.Closed', () => {
    const socket = mkSocket();
    expect(socket.getReadyState()).toBe(ESocketReadyState.Closed);

    socket.connect();
    expect(socket.getReadyState()).toBe(ESocketReadyState.Connecting);
  });

  it('"send" sends a message via socket', () => {
    const socket = mkSocket();
    expect(() => socket.send('123')).toThrow();

    socket.connect();
    const spy = jest.spyOn(getSocket(socket), 'send')
      .mockImplementationOnce(jest.fn);
    socket.send('message');
    expect(spy).toHaveBeenCalledWith('message');
  });

  it('"bindEvents" throws an error if socket is not initialized', () => {
    const socket = mkSocket();

    expect(() => (socket as any).bindEvents()).toThrow();
  });

  describe('onMessage', () => {
    it('should respond with PONG if signal was PING', () => {
      const socket = mkSocket();
      socket.connect();

      const sendSpy = jest.spyOn(socket, 'send')
        .mockImplementationOnce(jest.fn);
      const messageEvent = new MessageEvent('message', {
        data: 'PING :tmi.twitch.tv',
      });
      emitEvent(socket, messageEvent);

      expect(sendSpy).toHaveBeenCalledWith(ESignal.Pong);
    });

    it('should reconnect socket if signal was RECONNECT', () => {
      const socket = mkSocket();
      const disconnectSpy = jest.spyOn(socket, 'disconnect');
      const connectSpy = jest.spyOn(socket, 'connect');
      socket.connect();

      const messageEvent = new MessageEvent('message', {
        data: 'RECONNECT :tmi.twitch.tv',
      });
      emitEvent(socket, messageEvent);

      expect(disconnectSpy).toHaveBeenCalledWith();
      expect(connectSpy).toHaveBeenCalledWith();
    });

    it('should ignore message if signal is not RECONNECT and PING', () => {
      const socket = mkSocket();
      const disconnectSpy = jest.spyOn(socket, 'disconnect');
      const connectSpy = jest.spyOn(socket, 'connect');
      const sendSpy = jest.spyOn(socket, 'send')
        .mockImplementationOnce(jest.fn);
      socket.connect();

      const event = new MessageEvent('message', {
        data: ':qbnk!qbnk@qbnk JOIN #qbnk',
      });
      emitEvent(socket, event);

      expect(disconnectSpy).not.toHaveBeenCalled();
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).not.toHaveBeenCalled();
    });
  });

  describe('onOpen', () => {
    it('should request capabilities: twitch.tv/membership, twitch.tv/tags and ' +
      'twitch.tv/commands on connection open', () => {
      const socket = mkSocket();
      const sendSpy = jest.spyOn(socket, 'send');
      socket.connect();

      const event = new Event('open');
      emitEvent(socket, event);

      expect(sendSpy).toHaveBeenCalledWith(`CAP REQ :twitch.tv/membership`);
      expect(sendSpy).toHaveBeenCalledWith(`CAP REQ :twitch.tv/tags`);
      expect(sendSpy).toHaveBeenCalledWith(`CAP REQ :twitch.tv/commands`);
    });

    it('should send "PASS {password}" and "NICK {login}" on connection ' +
      'open', () => {
      const auth = { login: 'husky', password: 'champagne' };
      const socket = mkSocket({ auth });
      const sendSpy = jest.spyOn(socket, 'send');
      socket.connect();

      const event = new Event('open');
      emitEvent(socket, event);

      expect(sendSpy).toHaveBeenCalledWith(`PASS ${auth.password}`);
      expect(sendSpy).toHaveBeenCalledWith(`NICK ${auth.login}`);
    });
  });
});

function getSocket(socket: Socket): WebSocket | undefined {
  return (socket as any).socket;
}

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}
