import {
  ECommand,
  EUserNoticeMessageId,
  ENoticeMessageId,
  IParsedMessage,
  IBadges,
  IEmotes,
} from '../../types';

// Documentation
// https://dev.twitch.tv/docs/irc/tags

// CLEARCHAT
export interface IClearChatMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  banDuration: number;
  user: string;
}

// CLEARMSG
export interface IClearMsgMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  login: string;
  message: string;
  targetMsgId: string;
}

// GLOBALUSERSTATE
export interface IGlobalUserStateMessage {
  parsedMessage: IParsedMessage;
  badgeInfo: IBadges | null;
  badges: IBadges | null;
  color: string | null;
  displayName: string;
  emoteSets: number[];
  userId: string;
}

// PRIVMSG
export interface IPrivateMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  badgeInfo: IBadges | null;
  badges: IBadges | null;
  color: string | null;
  displayName: string;
  emotes: IEmotes;
  emoteOnly?: boolean;
  id: string;
  roomId: number;
  tmiSentTs: number;
  userId: string;
  message: string;
  bits: number | null;
}

// ROOMSTATE
export interface IRoomstateMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  emoteOnly: boolean;
  followersOnly: -1 | 0 | number;
  r9k: boolean;
  slow: number;
  subsOnly: boolean;
}

// USERNOTICE
export type TSubPlan = 'Prime' | number;
export type TOriginId = number[];

export interface IUserNoticeSub {
  cumulativeMonths: number;
  months: number;
  shouldShareStreak: boolean;
  subPlanName: string;
  subPlan: TSubPlan;
}

export interface IUserNoticeResub extends IUserNoticeSub {
  streakMonths?: number;
}

export interface IUserNoticeRaid {
  displayName: string;
  login: string;
  viewerCount: number;
}

export interface IUserNoticeSubgiftAndAnonSubgift {
  months: number;
  recipientDisplayName: string;
  recipientId: string;
  recipientUserName: string;
  subPlan: TSubPlan;
  subPlanName: string;
}

export interface IUserNoticeGiftPaidUpgradeAndAnonGiftPaidUpgrade {
  promoGiftTotal: number;
  promoName: string;
}

export interface IUserNoticeGiftPaidUpgrade {
  senderLogin: string;
  senderName: string;
}

export interface IUserNoticeRitual {
  ritualName: string;
}

export interface IUserNoticeBitsBadgeTier {
  threshold: number;
}

export interface IUserNoticeRewardGift {
  domain: string;
  selectedCount: number;
  totalRewardCount: number;
  triggerAmount: number;
  triggerType: string;
}

export interface IUserNoticePrimePaidUpgrade {
  subPlan: TSubPlan;
}

export interface IUserNoticeSubGift {
  months: number;
  originId: TOriginId;
  recipientDisplayName: string;
  recipientId: number;
  recipientUserName: string;
  senderCount: number;
  subPlan: TSubPlan;
  subPlanName: string;
}

export interface IUserNoticeSubMysteryGift {
  massGiftCount: number;
  subPlan: TSubPlan;
  originId: TOriginId;
  senderCount: number;
}

export interface IUserNoticeParamsMap {
  [EUserNoticeMessageId.AnonymousSubscriberGift]: IUserNoticeSubgiftAndAnonSubgift;
  [EUserNoticeMessageId.AnonymousGiftPaidUpgrade]: IUserNoticeGiftPaidUpgradeAndAnonGiftPaidUpgrade;
  [EUserNoticeMessageId.BitsBadgeTier]: IUserNoticeBitsBadgeTier;
  [EUserNoticeMessageId.GiftPaidUpgrade]: IUserNoticeGiftPaidUpgrade & IUserNoticeGiftPaidUpgradeAndAnonGiftPaidUpgrade;
  [EUserNoticeMessageId.PrimePaidUpgrade]: IUserNoticePrimePaidUpgrade;
  [EUserNoticeMessageId.Raid]: IUserNoticeRaid;
  [EUserNoticeMessageId.Ritual]: IUserNoticeRitual;
  [EUserNoticeMessageId.RewardGift]: IUserNoticeRewardGift;
  [EUserNoticeMessageId.Resubscribe]: IUserNoticeResub;
  [EUserNoticeMessageId.Subscribe]: IUserNoticeSub;
  [EUserNoticeMessageId.SubscriberGift]: IUserNoticeSubGift;
  [EUserNoticeMessageId.SubscriberMysteryGift]: IUserNoticeSubMysteryGift;
}

export type TUserNoticeMessage<MsgId extends keyof IUserNoticeParamsMap> =
  {
    parsedMessage: IParsedMessage;
    channel: string;
    badgeInfo: IBadges | null;
    badges: IBadges | null;
    color: string | null;
    displayName: string;
    emotes: IEmotes;
    id: string;
    login: string;
    message: string | null;
    msgId: MsgId;
    roomId: number;
    systemMsg: string;
    tmiSentTs: number;
    userId: string;
  }
  & (MsgId extends null ? {} : {params: IUserNoticeParamsMap[MsgId]});

// USERSTATE
export interface IUserStateMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  badgeInfo: IBadges | null;
  badges: IBadges | null;
  color: string | null;
  displayName: string;
  emoteSets: number[];
}

// NOTICE
export interface INoticeMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  message: string;
  msgId: ENoticeMessageId;
}

// JOIN
export interface IJoinMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  user: string;
}

// PART
export interface IPartMessage {
  parsedMessage: IParsedMessage;
  channel: string;
  user: string;
}

// HOSTTARGET
export interface IHostMessage {
  parsedMessage: IParsedMessage;
  channel: string | '-';
  hostingChannel: string;
  numberOfViewers: number | null;
  isHosting: boolean;
}

export interface IEventMessages {
  [ECommand.ClearChat]: IClearChatMessage;
  [ECommand.ClearMessage]: IClearMsgMessage;
  [ECommand.GlobalUserState]: IGlobalUserStateMessage;
  [ECommand.Host]: IHostMessage;
  [ECommand.Join]: IJoinMessage;
  [ECommand.Leave]: IPartMessage;
  [ECommand.Message]: IPrivateMessage;
  [ECommand.Notice]: INoticeMessage;
  [ECommand.Reconnect]: IParsedMessage;
  [ECommand.RoomState]: IRoomstateMessage;
  [ECommand.UserNotice]: TUserNoticeMessage<any>;
  [ECommand.UserState]: IUserStateMessage;
}

export type TEventTransformers = {
  [Signal in keyof IEventMessages]: (message: IParsedMessage) => IEventMessages[Signal];
}

export type TKnownEvent = keyof IEventMessages;
