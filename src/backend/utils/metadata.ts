import { get as _get, has, set, unset, update as _update } from "lodash";

export const add = ($this: any) => (key: string, value: any): void => {
  if (!$this.metadata) $this.metadata = {};
  if (has($this.metadata, key)) throw new Error(" already exists.");
  set($this.metadata, key, value);
}

export const remove = ($this: any) => (key: string): void => {
  unset($this.metadata, key);
}

export const update = ($this: any) => (key: string, value: any): void => {
  set($this.metadata, key, value);
}

export const get = ($this: any) => (key: string): any => {
  return _get($this.metadata, key);
}

export const process = ($this: any) => (key: Array<string>|string, func: () => any): void => {
  if(has($this.metadata, key)) {
    _update($this.metadata, key, func);
  } else {
    throw new Error("Cannot process data at key: " + key);
  }
}

export const updateInPlace = ($this: any) => (metadata: { [key: string]: any }): void => {
  set($this, "metadata", metadata);
}

export default {
  add,
  remove,
  update,
  get,
  process,
  updateInPlace
}