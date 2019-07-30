/// <reference types="jest"/>
import { UtilsRepository } from '../repository';
import { commandHandlersMap } from '../handlers';
import { EIRCCommand } from '../../../types';

describe('repositories', () => {
  describe('utils', () => {
    describe('repository', () => {
      describe('sendRawMessage', () => {
        it('Should call "send" method of socket passed via constructor with ' +
          'passed parameter', () => {
          const socket = mkSocket();
          const utils = new UtilsRepository(socket as any);
          const message = 'Hi Justin!';

          utils.sendRawMessage(message);
          expect(socket.send).toHaveBeenCalledWith(message);
        });
      });

      describe('sendCommand', () => {
        it('Should pick handler from commandHandlersMap and call it with ' +
          'sendRawMessage and passed params', () => {
          const socket = mkSocket();
          const utils = new UtilsRepository(socket as any);
          const params = { channel: 'summit1g' };
          const spy = jest.spyOn(commandHandlersMap, EIRCCommand.JoinChannel);

          utils.sendCommand(EIRCCommand.JoinChannel, params);
          expect(spy).toHaveBeenCalledWith(utils.sendRawMessage, params);
        });
      });
    });
  });
});

const mkSocket = () => {
  return {
    send: jest.fn(),
  };
};
