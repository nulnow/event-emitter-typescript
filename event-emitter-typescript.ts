type EventMap = {
  [key: string | number | symbol]: unknown; // (...args: any[]) => void;
};

type Subscriber<T> = (data: T[keyof T]) => void;

/**
 * EventEmitter class.
 *
 * Accepts custom event map as a generic param.
 *
 * new EventEmitter\<Events\>();
 *
 * @example
 * import {EventEmitter} from "event-emitter-typescript";
 *
 * const eventEmitter = new EventEmitter<{
 *   userRegistered: { name: string; email: string; };
 *   otherEvent: { data: string; };
 * }>();
 *
 * // typesafe, we have inferred user type here
 * const unsubscribe = eventEmitter.on("userRegistered", async (user) => {
 *   await userRepository.save(user);
 * });
 *
 * // typesafe
 * eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });
 *
 * // typescript error, email should be present
 * eventEmitter.emit("userRegistered", { name: "John Doe" });
 *
 * @template CustomEventMap
 */
export class EventEmitter<Events extends EventMap> {
  private subscribers = new Map<keyof Events, Array<Subscriber<Events>>>();

  /**
   * Subscribes an event handler to the event
   * @template {E} extends keyof CustomEventMap
   * @param event Key of provided custom event map
   * @param subscriber Event handler
   * @return {() => void} Function to unsubscribe the event handler
   *
   * @example
   * // typesafe
   * const unsubscribe = eventEmitter.on("userRegistered", async (user) => {
   *   await userRepository.save(user);
   * });
   *
   * // typesafe
   * eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });
   *
   * // Call unsubscribe fn when we do not need to listen for "userRegistered" anymore
   * unsubscribe();
   */
  on<E extends keyof Events>(
    event: E,
    subscriber: (data: Events[E]) => void
  ): () => void {
    let eventSubscribers = this.subscribers.get(event);

    if (!eventSubscribers) {
      eventSubscribers = [];
    }

    eventSubscribers.push(subscriber as Subscriber<Events>);

    this.subscribers.set(event, eventSubscribers);

    return () => {
      this.off(event, subscriber);
    };
  }

  /**
   * Emits an event to the subscribers
   * @template E
   * @param event Key of provided custom event map
   * @param arg Event data
   *
   * @example
   * // typesafe
   * eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });
   */
  emit<E extends keyof Events>(event: E, arg: Events[E]) {
    if (!this.subscribers.has(event)) {
      return;
    }

    for (const subscriber of this.subscribers.get(event)!) {
      subscriber(arg);
    }
  }

  /**
   * Unsubscribes an event handler from the event
   * @template E
   * @param event Key of provided custom event map
   * @param subscriber Event handler
   *
   * @example
   * eventEmitter.off("userRegistered", registeredHandler);
   */
  off<E extends keyof Events>(
    event: E,
    subscriber: (data: Events[E]) => void
  ): void {
    const eventSubscribers = this.subscribers.get(event);

    if (!eventSubscribers || !eventSubscribers.length) {
      return;
    }

    this.subscribers.set(
      event,
      eventSubscribers.filter(sub => sub !== subscriber)
    );
  }
}
