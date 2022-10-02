import { getKeyDict, KeyDict, keys } from "./keys";

describe('Keys binding', () => {
  it('has no duplication', () => {
    const dict: {[key: string]: {[rShiftCount: number]: true}} = {};
    for (const key of keys) {
      if (dict[key.key]) {
        expect(dict[key.key][key.rShiftCount]).toBeFalsy();
      }
      if (!dict[key.key]) {
        dict[key.key] = {};
      }
      dict[key.key][key.rShiftCount] = true;
      expect(dict[key.key][key.rShiftCount]).toBeTrue();
    }
  });

  it('get dict', () => {
    const dict: KeyDict = getKeyDict();
    for (const key of keys) {
      expect(dict[key.key][key.rShiftCount]).toEqual(key.character);
    }
  });
});
