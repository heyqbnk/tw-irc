import { TObservableSignals } from './observable';
import { TSignalListenersMap, TSignalListener } from './listeners';

export interface ISignalListener {
  signal: TObservableSignals;
  listener: TSignalListener<any>;
}

export type TListeningManipulator = <Signal extends TObservableSignals>(
  signal: Signal,
  listener: TSignalListenersMap[Signal],
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
