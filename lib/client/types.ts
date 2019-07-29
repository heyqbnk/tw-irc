interface IAuthInfo {
  login: string;
  password: string;
}

interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

export { IAuthInfo, IClientConstructorProps };
