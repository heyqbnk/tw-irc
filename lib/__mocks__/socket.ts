import { IAuthData } from '../socket/types';
import { Socket } from '../socket';

export function mkSocket(
  props: { auth?: IAuthData, secure?: boolean } = {},
): Socket {
  const {
    auth = { login: '', password: '' },
    secure = false,
  } = props;

  return new Socket({ auth, secure });
}
