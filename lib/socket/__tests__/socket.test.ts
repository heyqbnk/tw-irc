import { Socket } from '../socket';
import { ESocketReadyState } from '../../types';

describe('socket', () => {
  it('"connect" creates WebSocket instance and closes previous connection', () => {
    const socket = new Socket({ secure: false });

    expect(getSocket(socket)).toBe(undefined);
    socket.connect();
    const ws = getSocket(socket);
    const closeSpy = jest.spyOn(ws, 'close');
    expect(ws).toBeInstanceOf(WebSocket);

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
      .mockImplementationOnce(() => {
      });
    socket.send('message');
    expect(spy).toHaveBeenCalledWith('message');
  });

  it('"bindEvents" throws an error if socket is not initialized', () => {
    const socket = new Socket({ secure: true });

    expect(() => (socket as any).bindEvents()).toThrow();
  });
});

function getSocket(socket: Socket): WebSocket | undefined {
  return (socket as any).socket;
}
