// TODO: create @types/hashish from this start (or switch to another dependency?)

declare module 'hashish' {
  export function merge<T extends {}> (...objects: Partial<T>[]): T
}
