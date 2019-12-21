export interface IAuthInfo {
  login: string;
  password: string;
}

export interface IRoom {
  channelId: string;
  roomUuid: string;
}

export type TChannel = string;
export type TPlace = TChannel | IRoom;