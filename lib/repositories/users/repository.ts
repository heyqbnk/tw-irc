import { Client } from '../../client';
import { IUsersRepository, TUserCommand } from './types';

class UsersRepository implements IUsersRepository {
  private readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  /**
   * User-oriented commands generator.
   * @param {string} command
   * @returns {TUserCommand}
   */
  private userCommand = (command: string): TUserCommand => {
    return (user, channel) => this.client.say(`${command} ${user}`, channel);
  };

  public ban = this.userCommand('/ban');
  public unban = this.userCommand('/unban');

  public mod = this.userCommand('/mod');
  public unmod = this.userCommand('/unmod');

  public vip = this.userCommand('/vip');
  public unvip = this.userCommand('/unvip');

  public timeout = (
    user: string,
    duration = '10m',
    reason?: string,
    channel?: string,
  ) => {
    this.client.say(
      `/timeout ${user} ${duration}${reason ? ` ${reason}` : ''}`,
      channel,
    );
  };
  public untimeout = this.userCommand('/untimeout');

  public whisper = (user: string, message: string, channel?: string) => {
    this.client.say(`/w ${user} ${message}`, channel);
  };
}

export { UsersRepository };
