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

      it('"slowmode" field must be object with fields "on" and "off". "off" ' +
        'sends a message "/slowoff", "on" sends "/slow {secs}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const duration = 300;

        expect(repo.slowmode).toEqual({
          on: expect.any(Function),
          off: expect.any(Function),
        });
        repo.slowmode.on(duration, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/slow ${duration}`, channel);

        repo.slowmode.off(channel);
        expect(client.say).toHaveBeenLastCalledWith('/slowoff', channel);
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

      it('"marker" says "/marker {comment}"', () => {
        const client = mkClient();
        const channel = 'channel';
        const repo = new ChannelsRepository(client as any);
        const comment = 'some comment';

        repo.marker(comment, channel);
        expect(client.say).toHaveBeenLastCalledWith(`/marker ${comment}`, channel);
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
        ['followersOnly', '/followers', '/followersoff'],
        ['r9k', '/r9kbeta', '/r9kbetaoff'],
      ]).it('Command %s should be object with fields "on" and "off". "on" ' +
        'field is a function sending message "%s" to channel and "off" is ' +
        'a function sending message "%s"',
        (command: string, onMessage: string, offMessage: string) => {
          const client = mkClient();
          const channel = 'channel';
          const repo = new ChannelsRepository(client as any);
          const handler = repo[command];

          expect(handler).toEqual({
            on: expect.any(Function),
            off: expect.any(Function),
          });
          handler.on(channel);
          expect(client.say).toHaveBeenLastCalledWith(onMessage, channel);

          handler.off(channel);
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
