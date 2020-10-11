import {objectKeys} from '../typings/common-types.js';

export function objFilter<T extends object>(
  original = {} as T,
  filter: (k: keyof T, v: T[keyof T]) => boolean = () => true
) {
  const obj = {} as T;
  objectKeys(original).forEach(key => {
    if (filter(key, original[key])) {
      obj[key] = original[key];
    }
  });
  return obj;
}
