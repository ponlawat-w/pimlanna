import type { InputLayout } from './layout';
import type { KeyMapping } from './mapping';
import { Characters } from 'lanna-utils';

export type SpecialButtonKey = 'Backspace'|'Enter'|'LeftShift'|'RightShift'|'Spacebar'|'RightAlt';
export type SpecialKey = { key: SpecialButtonKey, display: string, width?: number };
export const SPECIAL_KEYS: {[name: string]: SpecialKey} = {
  BACKSPACE: { key: 'Backspace', display: '←', width: 10 },
  ENTER: { key: 'Enter', display: '↲', width: 10 },
  LEFT_SHIFT: { key: 'LeftShift', display: '↑', width: 12 },
  RIGHT_SHIFT: { key: 'RightShift', display: '※', width: 12 },
  SPACEBAR: { key: 'Spacebar', display: '', width: 48 },
  RIGHT_ALT: { key: 'RightAlt', display: Characters.signSakot }
};

export type KeyboardButtonOptions = {
  key?: string,
  keyShifted?: string,
  latin?: string,
  display?: string
  taitham?: string[],
  taithamShifted?: string[],
  width?: number,
  special?: boolean
};

export class KeyboardButton {
  public readonly key: string;
  public readonly keyShifted: string;
  public readonly latin: string;
  public readonly display: string;
  public readonly taitham: string[];
  public readonly taithamShifted: string[];
  public readonly width: number;
  public readonly special: boolean;

  private constructor (options: KeyboardButtonOptions) {
    this.key = options.key ?? '';
    this.keyShifted = options.keyShifted ?? '';
    this.latin = options.latin ? this.key !== options.latin && this.keyShifted !== options.latin ? options.latin : '' : '';
    this.display = options.display ?? '';
    this.taitham = options.taitham ?? [];
    this.taithamShifted = options.taithamShifted ?? [];
    this.width = options.width ?? 7;
    this.special = options.special ?? false;
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
    const rows: KeyboardRow[] = [];
    for (const layoutRow of inputLayout) {
      const row: KeyboardRow = [];
      for (const layoutButton of layoutRow) {
        const { key, keyShifted, latin, width } = layoutButton;
        const buttonKeyMappings = keyMappings.filter(x => x.key === key);
        const shiftedButtonKeyMappings = keyMappings.filter(x => x.key === keyShifted);
        const button = new KeyboardButton({
          key, keyShifted, latin, width,
          taitham: KeyboardButton.getTaithamFromKeyMappings(buttonKeyMappings),
          taithamShifted: KeyboardButton.getTaithamFromKeyMappings(shiftedButtonKeyMappings)
        });
        row.push(button);
      }
      rows.push(row);
    }
    return [
      rows[0] ?? [],
      rows[1] ?? [],
      rows[2] ?? [],
      rows[3] ?? [],
      rows[4] ?? []
    ];
  }

  public static getSpecialKey(key: SpecialKey): KeyboardButton {
    return new KeyboardButton({ key: key.key, display: key.display, width: key.width, special: true });
  }
};

export type KeyboardRow = KeyboardButton[];
export type KeyboardLayout = [KeyboardRow, KeyboardRow, KeyboardRow, KeyboardRow, KeyboardRow];
