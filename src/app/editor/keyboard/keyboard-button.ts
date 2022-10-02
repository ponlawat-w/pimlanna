import { Key, keys as defaultKeys } from 'src/keys';

export type KeyboardLayoutButton = {
  thai: string,
  thaiShift: string,
  latin: string
};

export type TaithamKeys = {[rShift: number]: string};

export class TaithamKeyboardButton {
  public taitham: TaithamKeys;
  public taithamShift: TaithamKeys;
  public thai: string;
  public thaiShift: string;
  public latin: string;

  constructor(layout: KeyboardLayoutButton, taitham: TaithamKeys, taithamShift: TaithamKeys) {
    this.taitham = taitham;
    this.taithamShift = taithamShift;
    this.thai = layout.thai;
    this.thaiShift = layout.thaiShift;
    this.latin = layout.latin;
  }
};

export type KeyboardLayoutRow = {
  left: string,
  keys: KeyboardLayoutButton[]
};

export type TaitthamKeyboardRow = {
  left: string,
  keys: TaithamKeyboardButton[]
};

export const keyboardLayout: KeyboardLayoutRow[] = [
  {left: '0', keys: [
    {thai: '_', thaiShift: '%', latin: '`'},
    {thai: 'ๅ', thaiShift: '+', latin: '1'},
    {thai: '/', thaiShift: '๑', latin: '2'},
    {thai: '-', thaiShift: '๒', latin: '3'},
    {thai: 'ภ', thaiShift: '๓', latin: '4'},
    {thai: 'ถ', thaiShift: '๔', latin: '5'},
    {thai: 'ุ', thaiShift: 'ู', latin: '6'},
    {thai: 'ึ', thaiShift: '฿', latin: '7'},
    {thai: 'ค', thaiShift: '๕', latin: '8'},
    {thai: 'ต', thaiShift: '๖', latin: '9'},
    {thai: 'จ', thaiShift: '๗', latin: '0'},
    {thai: 'ข', thaiShift: '๘', latin: '-'},
    {thai: 'ช', thaiShift: '๙', latin: '='},
  ]},
  {left: '8%', keys: [
    {thai: 'ๆ', thaiShift: '๐', latin: 'q'},
    {thai: 'ไ', thaiShift: '"', latin: 'w'},
    {thai: 'ำ', thaiShift: 'ฎ', latin: 'e'},
    {thai: 'พ', thaiShift: 'ฑ', latin: 'r'},
    {thai: 'ะ', thaiShift: 'ธ', latin: 't'},
    {thai: 'ั', thaiShift: 'ํ', latin: 'y'},
    {thai: 'ี', thaiShift: '๊', latin: 'u'},
    {thai: 'ร', thaiShift: 'ณ', latin: 'i'},
    {thai: 'น', thaiShift: 'ฯ', latin: 'o'},
    {thai: 'ย', thaiShift: 'ญ', latin: 'p'},
    {thai: 'บ', thaiShift: 'ฐ', latin: '['},
    {thai: 'ล', thaiShift: ',', latin: ']'},
    {thai: 'ฃ', thaiShift: 'ฅ', latin: '\\'}
  ]},
  {left: '10%', keys: [
    {thai: 'ฟ', thaiShift: 'ฤ', latin: 'a'},
    {thai: 'ห', thaiShift: 'ฆ', latin: 's'},
    {thai: 'ก', thaiShift: 'ฏ', latin: 'd'},
    {thai: 'ด', thaiShift: 'โ', latin: 'f'},
    {thai: 'เ', thaiShift: 'ฌ', latin: 'g'},
    {thai: '้', thaiShift: '็', latin: 'h'},
    {thai: '่', thaiShift: '๋', latin: 'j'},
    {thai: 'า', thaiShift: 'ษ', latin: 'k'},
    {thai: 'ส', thaiShift: 'ศ', latin: 'l'},
    {thai: 'ว', thaiShift: 'ซ', latin: ';'},
    {thai: 'ง', thaiShift: '.', latin: '\''}
  ]},
  {left: '0', keys: [
    {thai: 'ผ', thaiShift: '(', latin: 'z'},
    {thai: 'ป', thaiShift: ')', latin: 'x'},
    {thai: 'แ', thaiShift: 'ฉ', latin: 'c'},
    {thai: 'อ', thaiShift: 'ฮ', latin: 'v'},
    {thai: 'ิ', thaiShift: 'ฺ', latin: 'b'},
    {thai: 'ื', thaiShift: '์', latin: 'n'},
    {thai: 'ท', thaiShift: '?', latin: 'm'},
    {thai: 'ม', thaiShift: 'ฒ', latin: ','},
    {thai: 'ใ', thaiShift: 'ฬ', latin: '.'},
    {thai: 'ฝ', thaiShift: 'ฦ', latin: '/'},
  ]}
];

export const getTaithamLayout = (keys: Key[] = defaultKeys): TaitthamKeyboardRow[] => {
  return keyboardLayout.map(row => ({
    ...row,
    keys: row.keys.map(layout => {
      const taithamKeys: TaithamKeys = keys
        .filter(key => key.key === layout.thai)
        .reduce<TaithamKeys>((obj, key) => ({...obj, [key.rShiftCount]: key.character}), {});
      const taithamShiftKeys: TaithamKeys = keys
        .filter(key => key.key === layout.thaiShift)
        .reduce<TaithamKeys>((obj, key) => ({...obj, [key.rShiftCount]: key.character}), {});
      return new TaithamKeyboardButton(layout, taithamKeys, taithamShiftKeys);
    })
  }));
};
