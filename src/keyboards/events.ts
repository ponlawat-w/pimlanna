export enum KeyboardSource {
  Virtual, Physical
};

export type InsertCharacterEvent = {
  character: string,
  source: KeyboardSource
};

export type KeyboardEvents = {
  insert: InsertCharacterEvent,
  backspace: KeyboardSource
};
