export function isPromise<T>(
  maybePromise: T | Promise<T>
): maybePromise is Promise<T> {
  return (
    !!maybePromise &&
    !!(maybePromise as Promise<T>).then &&
    typeof (maybePromise as Promise<T>).then === 'function'
  );
}
