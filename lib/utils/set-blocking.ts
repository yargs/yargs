interface WriteStreamWithHandle {
  _handle: {
    setBlocking: Function;
  };
  isTTY: boolean;
}

export default function setBlocking(blocking: boolean) {
  // Deno and browser have no process object:
  if (typeof process === 'undefined') return;
  [process.stdout, process.stderr].forEach(_stream => {
    const stream = _stream as any as WriteStreamWithHandle;
    if (
      stream._handle &&
      stream.isTTY &&
      typeof stream._handle.setBlocking === 'function'
    ) {
      stream._handle.setBlocking(blocking);
    }
  });
}
