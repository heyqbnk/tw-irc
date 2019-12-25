// @ts-nocheck
import ChannelsRepository from '../ChannelsRepository';
import Socket from '../../Socket';
import {mkSocket as mockSocket} from '../../__mocks__/socket';

import each from 'jest-each';

const userCommands = ['mod', 'unmod', 'vip', 'unvip', 'ban', 'unban',
  'untimeout'];
const channelCommands = ['unhost', 'unraid', 'disconnect', 'clear'];
const controllerCommands = [
  ['emoteOnly', '/emoteonly'],
  ['r9k', '/r9kbeta'],
];
const targetedCommands = ['host', 'raid'];

const mkSocket: typeof mockSocket = (props) => {
  const socket = mockSocket(props);
  socket.connect();

  return socket;
};

function getSocket(socket: Socket): WebSocket | undefined {
  return (socket as any).socket;
}

describe('repositories', () => {
  describe('channels', () => {
    describe('repository', () => {
      describe('join', () => {
        it('should send "JOIN #{channel}"', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const spy = jest.spyOn(getSocket(socket), 'send')
            .mockImplementationOnce(jest.fn);

          repo.join(channel);

          expect(spy).toHaveBeenCalledWith(`JOIN #${channel}`);
        });
      });

      describe('say', () => {
        it('should send "PRIVMSG #{channel} :{message}" if channel is passed', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const message = 'Hey!';
          const spy = jest.spyOn(getSocket(socket), 'send')
            .mockImplementationOnce(jest.fn);

          repo.say(message, channel);

          expect(spy).toHaveBeenCalledWith(`PRIVMSG #${channel} :${message}`);
        });

        it('should throw an error if channel is not passed and not assigned', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);

          expect(() => repo.say('')).toThrow();
        });
      });

      describe('followersOnly', () => {
        it('should be object with fields "enable" and "disable" which ' +
          'are functions', () => {
          const repo = new ChannelsRepository(mkSocket());

          expect(repo.followersOnly).toEqual({
            enable: expect.any(Function),
            disable: expect.any(Function),
          });
        });

        describe('disable', () => {
          it('should say "/followersoff"', () => {
            const repo = new ChannelsRepository(mkSocket());
            const channel = 'channel';
            const spy = jest.spyOn(repo, 'say')
              .mockImplementationOnce(jest.fn);

            repo.followersOnly.disable(channel);
            expect(spy).toHaveBeenCalledWith('/followersoff', channel);
          });
        });

        describe('enable', () => {
          it('should say "/followers {duration}" and {channel} ' +
            'if duration in options is passed', () => {
            const socket = mkSocket();
            const repo = new ChannelsRepository(socket);
            const channel = 'channel';
            const duration = '20m';
            const spy = jest.spyOn(repo, 'say')
              .mockImplementationOnce(jest.fn);

            repo.followersOnly.enable({duration, channel});

            expect(spy).toHaveBeenCalledWith(`/followers ${duration}`, channel);
          });
        });
      });

      describe('deleteMessage', () => {
        it('should say "/delete {id}" and {channel}', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const id = 'something';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.deleteMessage(id, channel);

          expect(spy).toHaveBeenCalledWith(`/delete ${id}`, channel);
        });
      });

      describe('playCommercial', () => {
        it('should say "/commercial {duration}" and {channel} ' +
          'if duration in options is passed', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const duration = 60;
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.playCommercial({duration, channel});

          expect(spy).toHaveBeenCalledWith(`/commercial ${duration}`, channel);
        });

        it('should throw an error if duration is less than 0', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const duration = -20;

          expect(() => repo.playCommercial({duration})).toThrow();
        });
      });

      describe('marker', () => {
        it('should say "/marker {comment}" and {channel} ' +
          'if comment in options is passed', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const comment = 'Highlight!';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.marker({comment, channel});

          expect(spy).toHaveBeenCalledWith(`/marker ${comment}`, channel);
        });
      });

      each(userCommands).describe('%s', (method: string) => {
        it(`should say "/${method} {user}"`, () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const user = 'justin';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo[method](user, channel);

          expect(spy).toHaveBeenCalledWith(`/${method} ${user}`, channel);
        });
      });

      each(channelCommands).describe('%s', (method: string) => {
        it(`should say "/${method}"`, () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo[method](channel);

          expect(spy).toHaveBeenCalledWith(`/${method}`, channel);
        });
      });

      each(targetedCommands).describe('%s', (method: string) => {
        it(`should say "/${method} {targetChannel}" and {channel}`, () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const targetChannel = 'something';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo[method](targetChannel, channel);

          expect(spy).toHaveBeenCalledWith(`/${method} ${targetChannel}`, channel);
        });
      });

      // SHARED REPOSITORY TESTS
      describe('whisper', () => {
        it('should say "/w {user} {message}"', () => {
          const repo = new ChannelsRepository(mkSocket());
          const channel = 'channel';
          const message = 'ps!';
          const user = 'justin';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.whisper({message, user, place: channel});
          expect(spy).toHaveBeenCalledWith(`/w ${user} ${message}`, channel);
        });
      });

      describe('me', () => {
        it('should say "/me {action}" and {channel}', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const action = 'jumped';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.me(action, channel);

          expect(spy).toHaveBeenCalledWith(`/me ${action}`, channel);
        });
      });

      describe('changeColor', () => {
        it('should say "/color {color}" and {channel}', () => {
          const socket = mkSocket();
          const repo = new ChannelsRepository(socket);
          const channel = 'channel';
          const color = 'red';
          const spy = jest.spyOn(repo, 'say')
            .mockImplementationOnce(jest.fn);

          repo.changeColor(color, channel);

          expect(spy).toHaveBeenCalledWith(`/color ${color}`, channel);
        });
      });

      each(controllerCommands).describe('%s', (method: string, command: string) => {
        it('should be object with fields "enable" and "disable" which ' +
          'are functions', () => {
          const repo = new ChannelsRepository(mkSocket());

          expect(repo[method]).toEqual({
            enable: expect.any(Function),
            disable: expect.any(Function),
          });
        });

        describe('disable', () => {
          it(`should say "${command}"`, () => {
            const repo = new ChannelsRepository(mkSocket());
            const channel = 'channel';
            const spy = jest.spyOn(repo, 'say')
              .mockImplementationOnce(jest.fn);

            repo[method].disable(channel);
            expect(spy).toHaveBeenCalledWith(`${command}off`, channel);
          });
        });

        describe('enable', () => {
          it(`should say "${command}" and {channel}`, () => {
            const socket = mkSocket();
            const repo = new ChannelsRepository(socket);
            const spy = jest.spyOn(repo, 'say')
              .mockImplementationOnce(jest.fn);

            repo[method].enable();

            expect(spy).toHaveBeenCalledWith(command, undefined);
          });
        });
      });
    });
  });
});
