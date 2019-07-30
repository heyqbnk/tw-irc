import { Client } from '../../client';
import { TChannelCommand } from './types';
import { EIRCCommand } from '../../types';

class ChannelsRepository {
  private readonly client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  /**
   * Channel-oriented commands generator.
   * @param {string} command
   * @returns {TChannelCommand}
   */
  private channelCommand = (command: string): TChannelCommand => {
    return channel => this.client.say(command, channel);
  };

  /**
   * Mode-oriented commands generator.
   * @param {string} mode
   * @returns {{off: (channel?: string) => void;
   * on: (channel?: string) => void}}
   */
  private channelMode = (mode: string) => ({
    on: (channel?: string) => this.client.say(mode, channel),
    off: (channel?: string) => this.client.say(`${mode}off`, channel),
  });

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

  /**
   * Emote only mode.
   * @type {TChannelCommand}
   */
  public emoteOnly = this.channelMode('/emoteonly');

  /**
   * Followers only mode.
   * @type {TChannelCommand}
   */
  public followersOnly = this.channelMode('/followers');

  /**
   * R9K mode.
   * @type {{off: (channel?: string) => void; on: (channel?: string) => void}}
   */
  public r9k = this.channelMode('/r9kbeta');

  /**
   * Slowmode.
   * @type {{off: (channel?: string) => void;
   * on: (secs: number, channel?: string) => void}}
   */
  public slowmode = {
    ...this.channelMode('/slow'),
    on: (secs: number, channel?: string) =>
      this.client.say(`/slow ${secs}`, channel),
  };

  /**
   * Deletes message.
   * @param {string} msgId
   * @param {string} channel
   */
  public deleteMessage = (msgId: string, channel?: string) => {
    this.client.say(`/delete ${msgId}`, channel);
  };

  /**
   * Plays commercial ads.
   * @param durationInSeconds
   * @param {string} channel
   */
  public playCommercial = (durationInSeconds: number, channel?: string) => {
    this.client.say(`/commercial ${durationInSeconds}`, channel);
  };

  /**
   * Clears chat.
   * @type {TChannelCommand}
   */
  public clearChat = this.channelCommand('/clear');

  /**
   * Hosts channel.
   * @type {TChannelCommand}
   */
  public host = (targetChannel: string, channel?: string) => {
    this.client.say(`/host ${targetChannel}`, channel);
  }

  /**
   * Unhosts channel.
   * @type {TChannelCommand}
   */
  public unhost = this.channelCommand('/unhost');

  /**
   * Raids channel.
   * @type {TChannelCommand}
   */
  public raid = (targetChannel: string, channel?: string) => {
    this.client.say(`/raid ${targetChannel}`, channel);
  }

  /**
   * Unraids channel.
   * @type {TChannelCommand}
   */
  public unraid = this.channelCommand('/unraid');

  /**
   * Leaves a marker with comment.
   * @param {string} comment
   * @param {string} channel
   */
  public marker = (comment: string, channel?: string) => {
    this.client.say(`/marker ${comment}`, channel);
  };

  /**
   * Says a message, looking like an author of its message did something.
   * @param {string} action
   * @param {string} channel
   */
  public me = (action: string, channel?: string) => {
    this.client.say(`/me ${action}`, channel);
  };

  /**
   * Changes author color.
   * @param {string} color
   * @param {string} channel
   */
  public changeColor = (color: string, channel?: string) => {
    this.client.say(channel, `/color ${color}`);
  };
}

export { ChannelsRepository };
