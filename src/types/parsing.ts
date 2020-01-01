export type TMetaValue = null | boolean | number | string | IBadges | IEmotes
  | IFlag[] | number[];

export interface IBadges {
  [key: string]: number;
}

export interface IEmotes {
  [key: string]: Array<{from: number; to: number}>;
}

export interface IFlag {
  from: number;
  to: number;
  flags: Record<string, number>;
}

export interface IMeta {
  [key: string]: TMetaValue;
}

export interface IParsedMessage {
  meta: IMeta | null;
  prefix: string | null;
  message: string | null;
  command: string;
  channel: string | null;
  raw: string;
}
