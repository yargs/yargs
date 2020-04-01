// TODO: either create @types/set-blocking with this or convert set-blocking to typescript

declare function setBlocking(blocking: boolean): void;

declare module 'set-blocking' {
  export = setBlocking;
}
