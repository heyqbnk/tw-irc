/// <reference types="jest"/>
import { ChannelsRepository } from '../repository';

import each from 'jest-each';

describe('repositories', () => {
  describe('channels', () => {
    describe('repository', () => {
      it('"join" function should send JOIN command with passed parameter', () => {
        const client = mkClient();
        const repo = new ChannelsRepository(client as any);
        const channel = 'channel';

        repo.join(channel);

        expect(client.utils.sendSignal)
          .toHaveBeenCalledWith('JOIN', { channel });
      });

      it('"leave" function should send PART command with passed parameter', () => {
        const client = mkClient();
        const repo = new ChannelsRepository(client as any);
        const channel = 'channel';

        repo.leave(channel);

        expect(client.utils.sendSignal)
          .toHaveBeenCalledWith('PART', { channel });
      });

      describe('slowmode', () => {
        it('should be object with fields "enable" and "disable" which ' +
          'are functions', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);

          expect(repo.slowmode).toEqual({
            enable: expect.any(Function),
            disable: expect.any(Function),
          });
        });

        it('should say "/slowoff" when slowmode.disable() called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);
          const channel = 'channel';

          repo.slowmode.disable(channel);
          expect(client.say).toHaveBeenLastCalledWith('/slowoff', channel);
        });

        it('should say "/slow" when slowmode.enable() called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);

          repo.slowmode.enable();
          expect(client.say).toHaveBeenLastCalledWith('/slow', undefined);
        });

        it('should say "/slow {secs}" when slowmode.enable(secs) called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);
          const channel = 'channel';
          const duration = 300;

          repo.slowmode.enable(duration, channel);
          expect(client.say).toHaveBeenLastCalledWith(`/slow ${duration}`, channel);
        });
      });

      describe('followersOnly', () => {
        it('should be object with fields "enable" and "disable" which ' +
          'are functions', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);

          expect(repo.followersOnly).toEqual({
            enable: expect.any(Function),
            disable: expect.any(Function),
          });
        });

        it('should say "/followers" when followersOnly.disable() called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);
          const channel = 'channel';

          repo.followersOnly.disable(channel);
          expect(client.say).toHaveBeenLastCalledWith('/followersoff', channel);
        });

        it('should say "/followers" when followersOnly.enable() called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);
          const channel = 'channel';
          const duration = 300;

          repo.followersOnly.enable(duration, channel);
          expect(client.say).toHaveBeenLastCalledWith(`/followers ${duration}`, channel);
        });

        it('should say "/followers {mins}" when followersOnly.enable(mins) called', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);

          repo.followersOnly.enable();
          expect(client.say).toHaveBeenLastCalledWith('/followers', undefined);
        });
      });

      it('"deleteMessage" says "/delete {msgId}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const msgId = '918021';

        repo.deleteMessage(msgId, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/delete ${msgId}`, channel);
      });

      it('"playCommercial" says "/commercial {duration}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const duration = 230;

        repo.playCommercial(duration, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/commercial ${duration}`, channel);
      });

      it('"clearChat" says "/clear"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);

        repo.clearChat(channel);
        expect(client.say).toHaveBeenLastCalledWith('/clear', channel);
      });

      it('"host" says "/host {target}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const target = 'some channel';

        repo.host(target, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/host ${target}`, channel);
      });

      it('"unhost" says "/unhost"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);

        repo.unhost(channel);
        expect(client.say).toHaveBeenLastCalledWith('/unhost', channel);
      });

      it('"raid" says "/raid {target}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const target = 'some channel';

        repo.raid(target, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/raid ${target}`, channel);
      });

      describe('marker', () => {
        it('should say "/marker" if comment is not defined', () => {
          const client = mkClient();
          const repo = new ChannelsRepository(client as any);

          repo.marker();
          expect(client.say).toHaveBeenLastCalledWith('/marker', undefined);
        });

        it('should say "/marker {comment}" if comment is defined', () => {
          const client = mkClient();
          const channel = 'channel';
          const repo = new ChannelsRepository(client as any);
          const comment = 'some comment';

          repo.marker(comment, channel);
          expect(client.say).toHaveBeenLastCalledWith(`/marker ${comment}`, channel);
        });
      });

      it('"me" says "/me {action}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const action = 'some action';

        repo.me(action, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/me ${action}`, channel);
      });

      it('"changeColor" says "/color {color}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const color = 'some color';

        repo.changeColor(color, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/color ${color}`, channel);
      });

      each([
        ['emoteOnly', '/emoteonly', '/emoteonlyoff'],
        ['r9k', '/r9kbeta', '/r9kbetaoff'],
      ]).it('Command %s should be object with fields "enable" and "disable". ' +
        '"enable" field is a function sending message "%s" to channel ' +
        'and "disable" is a function sending message "%s"',
        (command: string, onMessage: string, offMessage: string) => {
          const client = mkClient();
          const channel = 'channel';
          const repo = new ChannelsRepository(client as any);
          const handler = repo[command];

          expect(handler).toEqual({
            enable: expect.any(Function),
            disable: expect.any(Function),
          });
          handler.enable(channel);
          expect(client.say).toHaveBeenLastCalledWith(onMessage, channel);

          handler.disable(channel);
          expect(client.say).toHaveBeenLastCalledWith(offMessage, channel);
        },
      );
    });
  });
});

const mkClient = () => {
  return {
    say: jest.fn(),
    utils: {
      sendSignal: jest.fn(),
    },
  };
};
