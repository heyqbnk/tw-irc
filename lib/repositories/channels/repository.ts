import { Client } from '../../client';
import {
  IChannelsRepository, IModeController,
  TChannelCommand,
  TTargetedCommand,
} from './types';
import { ESignal } from '../../types';

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
  private channelMode = (mode: string): IModeController => ({
    enable: (channel?: string) => this.client.say(mode, channel),
    disable: (channel?: string) => this.client.say(`${mode}off`, channel),
  });

  public join = (channel: string) => {
    this.client.utils.sendSignal(ESignal.Join, { channel });
  };

  public leave = (channel: string) => {
    this.client.utils.sendSignal(ESignal.Leave, { channel });
  };

  public emoteOnly = this.channelMode('/emoteonly');

  public followersOnly = {
    ...this.channelMode('/followers'),
    enable: (durationInMinutes?: number, channel?: string) => {
      const message = '/followers'
        + (durationInMinutes ? ` ${durationInMinutes}` : '');

      this.client.say(message, channel);
    },
  };

  public r9k = this.channelMode('/r9kbeta');

  public slowmode = {
    ...this.channelMode('/slow'),
    enable: (durationInSeconds?: number, channel?: string) => {
      const message = '/slow'
        + (durationInSeconds ? ` ${durationInSeconds}` : '');

      this.client.say(message, channel);
    },
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

  public marker = (comment?: string, channel?: string) => {
    const message = '/marker' + (comment ? ` ${comment}` : '');
    this.client.say(message, channel);
  };

  public me = (action: string, channel?: string) => {
    this.client.say(`/me ${action}`, channel);
  };

  public changeColor = (color: string, channel?: string) => {
    this.client.say(`/color ${color}`, channel);
  };
}

export { ChannelsRepository };
