export type KeyMapping = {
  taitham: string,
  key: string,
  rShiftCount?: number
};

export type KeyDict = {
  [key: string]: {
    [rShiftCount: number]: string
  }
};

export const getKeyDict = (keyMappings: KeyMapping[]): KeyDict => {
  const results: KeyDict = {};
  for (const key of keyMappings) {
    if (!results[key.key]) {
      results[key.key] = {};
    }
    results[key.key][key.rShiftCount ?? 0] = key.taitham;
  }
  return results;
};
