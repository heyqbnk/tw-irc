import { TObservableEvents } from './observable';
import { TSignalListenersMap, TSignalListener } from './listeners';

export interface ISignalListener {
  event: TObservableEvents;
  listener: TSignalListener<any>;
}

export type TListeningManipulator = <Command extends TObservableEvents>(
  event: Command,
  listener: TSignalListenersMap[Command],
) => void;

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
