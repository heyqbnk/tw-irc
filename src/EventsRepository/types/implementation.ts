import {IEventMessages, TKnownEvent} from './messages';

export interface IListener {
  event: TKnownEvent;
  listener: (params: any) => any;
}

export type TListeningManipulator = <Event extends TKnownEvent>(
  event: Event,
  listener: TListenersMap[Event],
) => void;

/**
 * Description of listeners for signals.
 * With this type it is easy to create new callbacks description.
 */
export type TListenersMap = {
  [Event in TKnownEvent]: (message: IEventMessages[Event]) => void;
};


/**
 * Implementation for EventsRepository class.
 */
export interface IEventsRepository {
  /**
   * Adds event listener for command.
   */
  on: TListeningManipulator;
  /**
   * Removes event listener from command.
   */
  off: TListeningManipulator;
}
