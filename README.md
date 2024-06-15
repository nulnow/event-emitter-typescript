# event-emitter-typescript

Typesafe Event Emitter for browser and Nodejs

Installation:

```bash
npm i event-emitter-typescript
```

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

##### Table of Contents

*   [EventEmitter](#eventemitter)
    *   [Examples](#examples)
    *   [on](#on)
        *   [Parameters](#parameters)
        *   [Examples](#examples-1)
    *   [emit](#emit)
        *   [Parameters](#parameters-1)
        *   [Examples](#examples-2)
    *   [off](#off)
        *   [Parameters](#parameters-2)
        *   [Examples](#examples-3)

#### EventEmitter

EventEmitter&lt;Events&gt; class.

Accepts custom event map as a generic param.

##### Examples

```typescript
import {EventEmitter} from "event-emitter-typescript";

const eventEmitter = new EventEmitter<{
  userRegistered: { name: string; email: string; };
  otherEvent: { data: string; };
}>();

// typesafe, we have inferred user type here
const unsubscribe = eventEmitter.on("userRegistered", async (user) => {
  await userRepository.save(user);
});

// typesafe
eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });

// typescript error, email should be present
eventEmitter.emit("userRegistered", { name: "John Doe" });
```

##### on

Subscribes an event handler to the event

###### Parameters

*   `event` **E** Key of provided custom event map
*   `subscriber` **function (data: Events\[E\]): void** Event handler

###### Examples

```typescript
// typesafe
const unsubscribe = eventEmitter.on("userRegistered", async (user) => {
  await userRepository.save(user);
});

// typesafe
eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });

// Call unsubscribe fn when we do not need to listen for "userRegistered" anymore
unsubscribe();
```

Returns **function (): void**&#x20;

##### emit

Emits an event to the subscribers

###### Parameters

*   `event` **E** Key of provided custom event map
*   `arg` **Events\[E\]** Event data

###### Examples

```typescript
// typesafe
eventEmitter.emit("userRegistered", { name: "John Doe", email: "johndoe@example.org" });
```

##### off

Unsubscribes an event handler from the event

###### Parameters

*   `event` **E** Key of provided custom event map
*   `subscriber` **function (data: Events\[E\]): void** Event handler

###### Examples

```typescript
eventEmitter.off("userRegistered", registeredHandler);
```

Returns **void**&#x20;
