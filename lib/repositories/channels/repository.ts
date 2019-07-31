import { Client } from '../../client';
import {
  IChannelsRepository,
  TChannelCommand,
  TTargetedCommand,
} from './types';
import { EIRCCommand } from '../../types';

class ChannelsRepository implements IChannelsRepository {
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

  public join = (channel: string) => {
    this.client.utils.sendCommand(EIRCCommand.JoinChannel, { channel });
  };

  public leave = (channel: string) => {
    this.client.utils.sendCommand(EIRCCommand.LeaveChannel, { channel });
  };

  public emoteOnly = this.channelMode('/emoteonly');

  public followersOnly = this.channelMode('/followers');

  public r9k = this.channelMode('/r9kbeta');

  public slowmode = {
    ...this.channelMode('/slow'),
    on: (durationInSeconds: number, channel?: string) =>
      this.client.say(`/slow ${durationInSeconds}`, channel),
  };

  public deleteMessage = (msgId: string, channel?: string) => {
    this.client.say(`/delete ${msgId}`, channel);
  };

  public playCommercial = (durationInSeconds: number, channel?: string) => {
    this.client.say(`/commercial ${durationInSeconds}`, channel);
  };

  public clearChat = this.channelCommand('/clear');

  public host: TTargetedCommand = (targetChannel, channel?) => {
    this.client.say(`/host ${targetChannel}`, channel);
  };

  public unhost = this.channelCommand('/unhost');

  public raid: TTargetedCommand = (targetChannel, channel?) => {
    this.client.say(`/raid ${targetChannel}`, channel);
  };

  public unraid = this.channelCommand('/unraid');

  public marker = (comment: string, channel?: string) => {
    this.client.say(`/marker ${comment}`, channel);
  };

  public me = (action: string, channel?: string) => {
    this.client.say(`/me ${action}`, channel);
  };

  public changeColor = (color: string, channel?: string) => {
    this.client.say(`/color ${color}`, channel);
  };
}

export { ChannelsRepository };
