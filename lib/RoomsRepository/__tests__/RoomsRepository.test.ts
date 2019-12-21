import RoomsRepository from '../RoomsRepository';
import Socket from '../../Socket';
import {mkSocket as mockSocket} from '../../__mocks__/socket';

describe('repositories', () => {
  describe('rooms', () => {
    describe('repository', () => {
      describe('join', () => {
        it('should send "JOIN #chatrooms:{channelId}:{roomUuid}"', () => {
          const socket = mkSocket();
          const repo = new RoomsRepository(socket);
          const room = {channelId: 'channel', roomUuid: '923199'};
          const {channelId, roomUuid} = room;
          const spy = jest.spyOn(getSocket(socket), 'send')
            .mockImplementationOnce(jest.fn);

          repo.join(room);

          expect(spy)
            .toHaveBeenCalledWith(`JOIN #chatrooms:${channelId}:${roomUuid}`);
        });
      });

      describe('say', () => {
        it('should send "PRIVMSG #chatrooms:{channelId}:{roomUuid} :{message}" ' +
          'if room is passed', () => {
          const socket = mkSocket();
          const repo = new RoomsRepository(socket);
          const room = {channelId: 'channel', roomUuid: '923199'};
          const {channelId, roomUuid} = room;
          const message = 'Hey!';
          const spy = jest.spyOn(getSocket(socket), 'send')
            .mockImplementationOnce(jest.fn);

          repo.say(message, room);

          expect(spy)
            .toHaveBeenCalledWith(`PRIVMSG #chatrooms:${channelId}:${roomUuid} :${message}`);
        });

        it('should send "PRIVMSG #chatrooms:{channelId}:{roomUuid} :{message}" ' +
          'if room is not passed but assigned', () => {
          const socket = mkSocket();
          const repo = new RoomsRepository(socket);
          const room = {channelId: 'channel', roomUuid: '923199'};
          const {channelId, roomUuid} = room;
          const message = 'Hey!';
          const spy = jest.spyOn(getSocket(socket), 'send')
            .mockImplementationOnce(jest.fn);

          repo.assign(room);
          repo.say(message);

          expect(spy)
            .toHaveBeenCalledWith(`PRIVMSG #chatrooms:${channelId}:${roomUuid} :${message}`);
        });

        it('should throw an error if channel is not passed and not assigned', () => {
          const socket = mkSocket();
          const repo = new RoomsRepository(socket);

          expect(() => repo.say('')).toThrow();
        });
      });
    });
  });
});

const mkSocket: typeof mockSocket = (props) => {
  const socket = mockSocket(props);
  socket.connect();

  return socket;
};

function getSocket(socket: Socket): WebSocket | undefined {
  return (socket as any).socket;
}
