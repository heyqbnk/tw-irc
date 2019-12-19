import {IAuthInfo} from '../types';
import Socket from '../socket';

export function mkSocket(
  props: {auth?: IAuthInfo; secure?: boolean} = {},
): Socket {
  const {
    auth = {login: '', password: ''},
    secure = false,
  } = props;

  return new Socket({auth, secure});
}
