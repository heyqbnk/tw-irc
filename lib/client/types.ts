interface IAuthInfo {
  login: string;
  password: string;
}

interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

type TUserCommand = (channel: string, user: string) => void;
type TChannelCommand = (channel: string) => void;

export { IAuthInfo, IClientConstructorProps, TUserCommand, TChannelCommand };
