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

enum ESocketReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

type TMetaValue = null | string | number | Array<string | number>;
type TMeta = Record<string, TMetaValue | TMetaValue[] | null>;

export { EIRCCommand, ESocketReadyState, TMeta, TMetaValue };
