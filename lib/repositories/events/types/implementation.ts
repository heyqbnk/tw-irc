import { TObservableEvents } from './observable';
import { TCallbacksMap, TCallback } from './callbacks';

export interface ICommandListener {
  command: TObservableEvents;
  listener: TCallback<any>;
}

export type TListeningManipulator = <Command extends TObservableEvents>(
  command: Command,
  listener: TCallbacksMap[Command],
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
