import { Client } from '../client';
import { EIRCCommand } from '../types/irc';

export class ChannelsRepository {
  private readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  /**
   * Joins channel.
   * @param {string} channel
   */
  public join = (channel: string) => {
    this.client.utils.sendCommand(EIRCCommand.JoinChannel, { channel });
  };

  /**
   * Leaves channel.
   * @param {string} channel
   */
  public leave = (channel: string) => {
    this.client.utils.sendCommand(EIRCCommand.LeaveChannel, { channel });
  };
}
