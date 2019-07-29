import { Client } from '../../client';
import { TUserCommand } from './types';

class UsersRepository {
  protected readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  /**
   * User-oriented commands generator.
   * @param {string} command
   * @returns {TUserCommand}
   */
  protected userCommand = (command: string): TUserCommand => {
    return (user, channel) => this.client.say(`${command} ${user}`, channel);
  };

  /**
   * Ban user.
   * @type {TUserCommand}
   */
  public ban = this.userCommand('/ban');

  /**
   * Unban user.
   * @type {TUserCommand}
   */
  public unban = this.userCommand('/unban');

  /**
   * Make user a moderator.
   * @type {TUserCommand}
   */
  public mod = this.userCommand('/mod');

  /**
   * Revoke moderation rights from user.
   * @type {TUserCommand}
   */
  public unmod = this.userCommand('/unmod');

  /**
   * Give user a timeout.
   * @param {string} user
   * @param {string} duration
   * @param {string} reason
   * @param {string} channel
   */
  public timeout = (
    user: string,
    duration = '10m',
    reason?: string,
    channel?: string,
  ) =>
    this.client.say(
      channel,
      `/timeout ${user} ${duration}${reason ? ` ${reason}` : ''}`,
    );

  /**
   * Revoke user's timeout.
   * @type {TUserCommand}
   */
  public untimeout = this.userCommand('/untimeout');

  /**
   * Make user a VIP.
   * @type {TUserCommand}
   */
  public vip = this.userCommand('/vip');

  /**
   * Remove user's VIP status.
   * @type {TUserCommand}
   */
  public unvip = this.userCommand('/unvip');

  /**
   * Whisper someone.
   * @param {string} channel
   * @param {string} user
   * @param {string} message
   * @returns {any}
   */
  public whisper = (user: string, message: string, channel?: string) =>
    this.client.say(`/w ${user} ${message}`, channel);
}

export { UsersRepository };
