import { Socket } from '../socket';
import { EIRCCommand, ESocketReadyState } from '../../types';
import { mockWebSocket, MockWebSocket } from '../../__mocks__/websocket';

mockWebSocket();

describe('socket', () => {
  it('"connect" creates WebSocket instance and closes previous connection', () => {
    const socket = new Socket({ secure: false });

    expect(getSocket(socket)).toBe(undefined);
    socket.connect();
    const ws = getSocket(socket);
    const closeSpy = jest.spyOn(ws, 'close');
    // Previously we have overridden WebSocket with MockWebSocket, so check it
    expect(ws).toBeInstanceOf(MockWebSocket);

    socket.connect();
    expect(closeSpy).toBeCalledWith();
  });

  it('"disconnect" closes connection if it exists. Otherwise ignore', () => {
    const socket = new Socket({ secure: false });

    socket.disconnect();

    socket.connect();
    const ws = getSocket(socket);
    const closeSpy = jest.spyOn(ws, 'close');
    socket.disconnect();

    expect(closeSpy).toBeCalledWith();
  });

  it('"on" adds event listener in case websocket exists. Otherwise, ignore', () => {
    const socket = new Socket({ secure: false });
    const listener = jest.fn();
    socket.on('message', () => {
    });

    socket.connect();
    const spy = jest.spyOn(getSocket(socket), 'addEventListener');
    socket.on('message', listener);

    expect(spy).toBeCalledWith('message', listener);
  });

  it('"off" should unbind existing listener. Otherwise ignore', () => {
    const socket = new Socket({ secure: false });
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
    const socket = new Socket({ secure: false });
    expect(socket.getReadyState()).toBe(ESocketReadyState.Closed);

    socket.connect();
    expect(socket.getReadyState()).toBe(ESocketReadyState.Connecting);
  });

  it('"send" sends a message via socket', () => {
    const socket = new Socket({ secure: true });
    expect(() => socket.send('123')).toThrow();

    socket.connect();
    const spy = jest.spyOn(getSocket(socket), 'send')
      .mockImplementationOnce(jest.fn);
    socket.send('message');
    expect(spy).toHaveBeenCalledWith('message');
  });

  it('"bindEvents" throws an error if socket is not initialized', () => {
    const socket = new Socket({ secure: true });

    expect(() => (socket as any).bindEvents()).toThrow();
  });

  it('when message is received, in case it is PING command, respond with ' +
    'PONG. Otherwise, ignore', () => {
    const socket = new Socket({ secure: true });
    socket.connect();

    const sendSpy = jest.spyOn(socket, 'send')
      .mockImplementationOnce(jest.fn);
    const messageEvent = new MessageEvent('message', {
      data: 'PING :tmi.twitch.tv',
    });
    emitEvent(socket, messageEvent);

    expect(sendSpy).toHaveBeenCalledWith(EIRCCommand.Pong);
    sendSpy.mockReset();

    const anotherMessage = new MessageEvent('message', {
      data: ':qbnk!qbnk@qbnk JOIN #qbnk',
    });
    emitEvent(socket, anotherMessage);

    expect(sendSpy).not.toHaveBeenCalled();
  });
});

function getSocket(socket: Socket): WebSocket | undefined {
  return (socket as any).socket;
}

function emitEvent(socket: Socket, event: Event) {
  (socket as any).socket.dispatchEvent(event);
}
