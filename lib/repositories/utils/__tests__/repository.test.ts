/// <reference types="jest"/>
import { UtilsRepository } from '../repository';
import { commandHandlersMap } from '../handlers';
import { EIRCCommand } from '../../../types';
import { mockWebSocket } from '../../../__mocks__/websocket';
import { Socket } from '../../../socket';

mockWebSocket();

describe('repositories', () => {
  describe('utils', () => {
    describe('repository', () => {
      describe('sendRawMessage', () => {
        it('Should call "send" method of socket passed via constructor with ' +
          'passed parameter', () => {
          const socket = new Socket({ secure: false });
          const sendSpy = jest.spyOn(socket, 'send');
          socket.connect();
          const utils = new UtilsRepository(socket);
          const message = 'Hi Justin!';

          utils.sendRawMessage(message);
          expect(sendSpy).toHaveBeenCalledWith(message);
        });
      });

      describe('sendCommand', () => {
        it('Should pick handler from commandHandlersMap and call it with ' +
          'sendRawMessage and passed params', () => {
          const socket = new Socket({ secure: false });
          socket.connect();
          const utils = new UtilsRepository(socket);
          const params = { channel: 'summit1g' };
          const spy = jest.spyOn(commandHandlersMap, EIRCCommand.JoinChannel);

          utils.sendCommand(EIRCCommand.JoinChannel, params);
          expect(spy).toHaveBeenCalledWith(utils.sendRawMessage, params);
        });
      });
    });
  });
});
