export enum KeyboardSource {
  Virtual, Physical
};

export type InsertCharacterEvent = {
  character: string,
  source: KeyboardSource
};
