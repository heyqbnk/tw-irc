import {TSignalListenersMap, TSignalListener} from './listeners';
import {TTransformableEvent} from './params';
import {IParsedIRCMessage} from '../../types';

type TUnknownListener = (message: IParsedIRCMessage) => any;

export type TDetectListener<Event> = Event extends TTransformableEvent
  ? TSignalListenersMap[Event]
  : TUnknownListener;

export interface ISignalListener {
  event: TTransformableEvent;
  listener: TSignalListener<any>;
}

export interface IEventListener {
  event: string;
  listener: TUnknownListener;
}

export type TListener = ISignalListener | IEventListener;

export type TSignalListeningManipulator = <Signal extends TTransformableEvent>(
  signal: Signal,
  listener: TSignalListenersMap[Signal],
) => void;

export type TEventListeningManipulator = (
  event: string,
  listener: TUnknownListener,
) => void;

export type TListeningManipulator = TSignalListeningManipulator
  | TEventListeningManipulator;

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
