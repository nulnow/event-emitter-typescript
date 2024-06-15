import { EventEmitter } from "./event-emitter-typescript";

describe("EventEmitter", () => {
  it("Subscribers receive events", () => {
    const eventEmitter = new EventEmitter<{ testEvent: string }>();

    const testEventHandler = jest.fn();
    eventEmitter.on("testEvent", testEventHandler);

    eventEmitter.emit("testEvent", "testValue");

    expect(testEventHandler).toBeCalledTimes(1);
    expect(testEventHandler).toBeCalledWith("testValue");
  });

  it("Subscribers can unsubscribe with a returned function", () => {
    const eventEmitter = new EventEmitter<{ testEvent: string }>();

    const testEventHandler = jest.fn();
    const unsubscribe = eventEmitter.on("testEvent", testEventHandler);

    unsubscribe();

    eventEmitter.emit("testEvent", "testValue");

    expect(testEventHandler).toBeCalledTimes(0);
  });

  it("Subscribers can unsubscribe with off method", () => {
    const eventEmitter = new EventEmitter<{ testEvent: string }>();

    const testEventHandler = jest.fn();
    eventEmitter.on("testEvent", testEventHandler);
    eventEmitter.off("testEvent", testEventHandler);

    eventEmitter.emit("testEvent", "testValue");

    expect(testEventHandler).toBeCalledTimes(0);
  });

  it("Emit with no listeners", () => {
    const eventEmitter = new EventEmitter<{ testEvent: string }>();
    eventEmitter.emit("testEvent", "testValue");
    eventEmitter.emit("testEvent", "testValue");
  });

  it("Unsubscribe called twice", () => {
    const eventEmitter = new EventEmitter<{ testEvent: string }>();

    const unsubscribe = eventEmitter.on("testEvent", () => {});

    unsubscribe();
    unsubscribe();
  });
});
