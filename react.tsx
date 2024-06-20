import React, {
  createContext,
  useEffect,
  useRef,
  ReactNode,
  useContext,
  FC
} from "react";
import {EventEmitter, EventMap, EventKey, Subscriber} from "./event-emitter-typescript";

const _useEvent = <EMap extends EventMap>(
  eventName: EventKey<EMap>,
  handler: Subscriber<EMap[EventKey<EMap>]>,
  eventEmitter: EventEmitter<EMap>,
): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return eventEmitter.on(eventName as string, (...args) => {
      return handlerRef.current(...args);
    });
  }, [eventName]);
};

export const createProvider = <EventMap extends Record<string, any>>(
  eventEmitter: EventEmitter<EventMap>
) => {
  const EventEmitterContext = createContext<EventEmitter<EventMap>>(
    eventEmitter
  );
  EventEmitterContext.displayName = "EventEmitterContext";

  const EventEmitterContextProvider: FC<{ children: ReactNode }> = ({
    children
  }) => {
    return (
      <EventEmitterContext.Provider value={eventEmitter}>
        {children}
      </EventEmitterContext.Provider>
    );
  };
  EventEmitterContextProvider.displayName = "EventEmitterContextProvider";

  return [
    EventEmitterContextProvider,
    {
      useEvent: <E extends EventKey<EventMap>>(
        eventName: E,
        handler: Subscriber<EventMap[E]>
      ) => {
        return _useEvent(eventName, handler as Subscriber<EventMap[EventKey<EventMap>]>, eventEmitter);
      },
      useEventEmitter: () => {
        return useContext(EventEmitterContext);
      },
      EventEmitterContext: EventEmitterContext,
    }
  ] as const;
};

