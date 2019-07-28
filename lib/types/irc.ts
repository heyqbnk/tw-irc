/**
 * List of commands which can be sent to IRC.
 */
enum EIRCCommand {
  CapabilityRequest = 'CAP REQ',
  JoinChannel = 'JOIN',
  LeaveChannel = 'PART',
  Message = 'PRIVMSG',
  Nickname = 'NICK',
  Password = 'PASS',
  Ping = 'PING',
  Pong = 'PONG',
}

type TMetaValue = null | string | number | Array<string | number>;
type TMeta = Record<string, TMetaValue | TMetaValue[] | null>;

export { EIRCCommand, TMeta, TMetaValue };
