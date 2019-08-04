import { ESignal } from './irc';

export type TMetaValue = string | number | IBadge | IEmote
  | Array<string | number | IBadge | IEmote>;

export interface IMeta extends Record<string, TMetaValue | null> {
}

/**
 * List of existing badges names.
 */
type TBadgeName = 'admin' | 'bits' | 'broadcaster' | 'global_mod' | 'moderator'
  | 'subscriber' | 'staff' | 'turbo';

/**
 * User's badge information.
 */
export interface IBadge {
  badge: TBadgeName;
  version: number;
}

export interface IEmote {
  emoteId: number;
  ranges: Array<{ from: number, to: number }>;
}

export interface IPrefix {
  nickName: string | null;
  user: string | null;
  host: string;
}

export interface IParsedIRCMessage {
  prefix: IPrefix | null;
  meta: IMeta | null;
  parameters: string[] | null;
  signal: ESignal | string;
  data: string;
  raw: string;
}
