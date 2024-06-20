import React, {useState} from "react";
import {act, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

import { EventEmitter } from "./event-emitter-typescript";
import {createProvider} from "./react";

type EventMap = {
  "set:message": string;
  "set:message:done": true;
};

const eventEmitter = new EventEmitter<EventMap>();

const [EventEmitterContextProvider, { useEvent, useEventEmitter }] = createProvider(eventEmitter);

const App = () => {
  const [message, setMessage] = useState("first-message");

  const eventEmitter = useEventEmitter();

  useEvent("set:message", (message) => {
    setMessage(message);

    eventEmitter.emit("set:message:done", true);
  });

  return (
    <h1>{message}</h1>
  );
};

describe("WithState", () => {
  it("Renders without crashing", async () => {
    render(
      <EventEmitterContextProvider>
        <App />
      </EventEmitterContextProvider>
    );

    await screen.findByText("first-message");

    const fn = jest.fn();
    await act(() => {
      eventEmitter.once("set:message:done", () => {
        fn();
      });
      eventEmitter.emit("set:message", "second-message");
    });

    await screen.findByText("second-message");

    expect(fn).toBeCalled();
  });
});
