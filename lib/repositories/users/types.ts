type TUserCommand = (user: string, channel?: string) => void;

/**
 * Implementation for UsersRepository class.
 */
interface IUsersRepository {
  /**
   * Bans user.
   */
  ban: TUserCommand;

  /**
   * Unbans user.
   */
  unban: TUserCommand;

  /**
   * Mods user.
   */
  mod: TUserCommand;

  /**
   * Unmods user.
   */
  unmod: TUserCommand;

  /**
   * Makes user VIP.
   */
  vip: TUserCommand;

  /**
   * Removes user's VIP status.
   */
  unvip: TUserCommand;

  /**
   * Gives user a timeout.
   * @param {string} user
   * @param {string} duration
   * @param {string} reason
   * @param {string} channel
   */
  timeout(
    user: string,
    duration?: string,
    reason?: string,
    channel?: string,
  ): void;

  /**
   * Removes user's timeout.
   */
  untimeout: TUserCommand;

  /**
   * Whispers someone.
   * @param {string} user
   * @param {string} message
   * @param {string} channel
   */
  whisper(
    user: string,
    message: string,
    channel?: string,
  ): void;
}

export { TUserCommand, IUsersRepository };
