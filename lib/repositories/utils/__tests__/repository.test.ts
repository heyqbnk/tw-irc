/// <reference types="jest"/>
import { UtilsRepository } from '../repository';
import { commandHandlersMap } from '../handlers';
import { ESignal } from '../../../types';
import { mockWebSocket } from '../../../__mocks__/websocket';
import { Socket } from '../../../socket';
import { IAuthData } from '../../../socket/types';

mockWebSocket();

describe('repositories', () => {
  describe('utils', () => {
    describe('repository', () => {
      describe('sendSignal', () => {
        it('Should pick handler from commandHandlersMap and call it with ' +
          'sendRawMessage and passed params', () => {
          const socket = mkSocket();
          socket.connect();
          const utils = new UtilsRepository(socket);
          const params = { channel: 'summit1g' };
          const spy = jest.spyOn(commandHandlersMap, ESignal.Join);

          utils.sendSignal(ESignal.Join, params);
          expect(spy).toHaveBeenCalledWith(socket.send, params);
        });
      });
    });
  });
});

function mkSocket(props: { auth?: IAuthData, secure?: boolean } = {}): Socket {
  const {
    auth = { login: '', password: '' },
    secure = false,
  } = props;

  return new Socket({ auth, secure });
}
