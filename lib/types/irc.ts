/**
 * List of commands which can be sent to or from IRC.
 */
export enum ESignal {
  CapabilityRequest = 'CAP REQ',
  ClearChat = 'CLEARCHAT',
  ClearMessage = 'CLEARMSG',
  GlobalUserState = 'GLOBALUSERSTATE',
  Host = 'HOSTTARGET',
  Join = 'JOIN',
  Leave = 'PART',
  Message = 'PRIVMSG',
  Nickname = 'NICK',
  Notice = 'NOTICE',
  Password = 'PASS',
  Ping = 'PING',
  Pong = 'PONG',
  Reconnect = 'RECONNECT',
  RoomState = 'ROOMSTATE',
  UserNotice = 'USERNOTICE',
  UserState = 'USERSTATE',
}
