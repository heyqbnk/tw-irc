import { EIRCCommand } from './irc';

export type TMetaValue = null | string | number | Array<string | number>;
export type TMeta = Record<string, TMetaValue | TMetaValue[] | null>;

export interface IPrefix {
  nickName: string | null;
  user: string | null;
  host: string;
}

export interface IParsedIRCMessage {
  prefix: IPrefix | null;
  meta: TMeta | null;
  parameters: string[] | null;
  command: EIRCCommand | string;
  data: string;
  raw: string;
}
