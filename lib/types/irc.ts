/**
 * List of commands which can be sent to or from IRC.
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

/**
 * List of states of socket connection.
 */
enum ESocketReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export { EIRCCommand, ESocketReadyState };
