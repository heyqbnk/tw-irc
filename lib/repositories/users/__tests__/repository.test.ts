/// <reference types="jest"/>
import { UsersRepository } from '../repository';

import each from 'jest-each';

describe('repositories', () => {
  describe('users', () => {
    describe('repository', () => {
      each([
        ['ban', '/ban'],
        ['unban', '/unban'],
        ['mod', '/mod'],
        ['unmod', '/unmod'],
        ['untimeout', '/untimeout'],
        ['vip', '/vip'],
        ['unvip', '/unvip'],
      ]).it(
        '"%s" method says "%s {user}"',
        (method: string, command: string) => {
          const client = mkClient();
          const repo = new UsersRepository(client as any);
          const user = 'justin';
          const channel = 'twitch';

          repo[method](user, channel);

          expect(client.say).toBeCalledWith(`${command} ${user}`, channel);
        });

      it('"timeout" says "/timeout {user} {duration} {reason}"', () => {
        const client = mkClient();
        const repo = new UsersRepository(client as any);
        const user = 'justin';
        const channel = 'twitch';
        const duration = '50m';
        const reason = 'some cool reason';

        repo.timeout(user, duration, reason, channel);

        expect(client.say)
          .toBeCalledWith(`/timeout ${user} ${duration} ${reason}`, channel);
      });

      it('"timeout" command default duration should be "10m"', () => {
        const client = mkClient();
        const repo = new UsersRepository(client as any);
        const user = 'justin';

        repo.timeout(user);

        expect(client.say).toBeCalledWith(`/timeout ${user} 10m`, undefined);
      });

      it('Should not set any reason if it is not stated in "timeout" command', () => {
        const client = mkClient();
        const repo = new UsersRepository(client as any);
        const user = 'justin';
        const duration = '50m';

        repo.timeout(user, duration);

        expect(client.say).toBeCalledWith(`/timeout ${user} ${duration}`, undefined);
      });

      it('"whisper" says "/w {user} {message}"', () => {
        const client = mkClient();
        const repo = new UsersRepository(client as any);
        const user = 'justin';
        const channel = 'twitch';
        const message = 'Hey!';

        repo.whisper(user, message, channel);

        expect(client.say).toBeCalledWith(`/w ${user} ${message}`, channel);
      });
    });
  });
});

const mkClient = () => {
  return {
    channel: 'kongo!',
    say: jest.fn(),
    utils: {
      sendCommand: jest.fn(),
    },
  };
};
