import { TObservableSignals } from './observable';
import { TSignalListenersMap, TSignalListener } from './listeners';

export interface ISignalListener {
  event: TObservableSignals;
  listener: TSignalListener<any>;
}

export type TListeningManipulator = <Command extends TObservableSignals>(
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
