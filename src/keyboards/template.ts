import type { InputLayout } from './layout';
import type { KeyMapping } from './mapping';

export class KeyboardButton {
  public readonly key: string;
  public readonly keyShifted: string;
  public readonly latin: string;
  public readonly taitham: string[];
  public readonly taithamShifted: string[];

  private constructor (
    key: string,
    keyShifted: string,
    latin: string,
    taitham: string[],
    taithamShifted: string[]
  ) {
    this.key = key;
    this.keyShifted = keyShifted;
    this.latin = this.key !== latin && this.keyShifted !== latin ? latin : '';
    this.taitham = taitham;
    this.taithamShifted = taithamShifted;
  }

  public getCurrentTaitham(rShiftCount: number = 0): string {
    return this.taitham[rShiftCount] ?? '';
  }

  public getCurrentShiftedTaitham(rShiftCount: number = 0): string {
    return this.taithamShifted[rShiftCount] ?? '';
  }

  public getCurrent(lShift: boolean = false, rShiftCount: number = 0): string {
    return (lShift ? this.taithamShifted : this.taitham)[rShiftCount] ?? '';
  }

  private static getTaithamFromKeyMappings(keyMappings: KeyMapping[]): string[] {
    return Object.assign([], keyMappings.reduce<{[index: number]: string}>((obj, curr) => ({...obj, [curr.rShiftCount ?? 0]: curr.taitham}), {}));
  }

  public static getKeyboardLayout(keyMappings: KeyMapping[], inputLayout: InputLayout): KeyboardLayout {
    const rows: KeyboardLayout = [];
    for (const layoutRow of inputLayout) {
      const row: KeyboardRow = [];
      for (const layoutButton of layoutRow) {
        const { key, keyShifted, latin } = layoutButton;
        const buttonKeyMappings = keyMappings.filter(x => x.key === key);
        const shiftedButtonKeyMappings = keyMappings.filter(x => x.key === keyShifted);
        const button = new KeyboardButton(
          key, keyShifted, latin,
          KeyboardButton.getTaithamFromKeyMappings(buttonKeyMappings),
          KeyboardButton.getTaithamFromKeyMappings(shiftedButtonKeyMappings)
        );
        row.push(button);
      }
      rows.push(row);
    }
    return rows;
  }
};

export type KeyboardRow = KeyboardButton[];
export type KeyboardLayout = KeyboardRow[];
