/**
 * A place where event occurred.
 */
export type TPlace =
  { channel: string }
  | { room: { channelId: string; roomUuid: string } };
