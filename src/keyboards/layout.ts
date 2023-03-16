type LayoutButton = {
  key: string,
  keyShifted: string,
  latin: string,
  width?: number
};

type LayoutRow = LayoutButton[];

export type InputLayout = LayoutRow[];

export const ThaiKedmanee: InputLayout = [
  [
    {key: '_', keyShifted: '%', latin: '`', width: 5},
    {key: 'ๅ', keyShifted: '+', latin: '1'},
    {key: '/', keyShifted: '๑', latin: '2'},
    {key: '-', keyShifted: '๒', latin: '3'},
    {key: 'ภ', keyShifted: '๓', latin: '4'},
    {key: 'ถ', keyShifted: '๔', latin: '5'},
    {key: 'ุ', keyShifted: 'ู', latin: '6'},
    {key: 'ึ', keyShifted: '฿', latin: '7'},
    {key: 'ค', keyShifted: '๕', latin: '8'},
    {key: 'ต', keyShifted: '๖', latin: '9'},
    {key: 'จ', keyShifted: '๗', latin: '0'},
    {key: 'ข', keyShifted: '๘', latin: '-'},
    {key: 'ช', keyShifted: '๙', latin: '='},
  ], [
    {key: 'ๆ', keyShifted: '๐', latin: 'q'},
    {key: 'ไ', keyShifted: '"', latin: 'w'},
    {key: 'ำ', keyShifted: 'ฎ', latin: 'e'},
    {key: 'พ', keyShifted: 'ฑ', latin: 'r'},
    {key: 'ะ', keyShifted: 'ธ', latin: 't'},
    {key: 'ั', keyShifted: 'ํ', latin: 'y'},
    {key: 'ี', keyShifted: '๊', latin: 'u'},
    {key: 'ร', keyShifted: 'ณ', latin: 'i'},
    {key: 'น', keyShifted: 'ฯ', latin: 'o'},
    {key: 'ย', keyShifted: 'ญ', latin: 'p'},
    {key: 'บ', keyShifted: 'ฐ', latin: '['},
    {key: 'ล', keyShifted: ',', latin: ']'},
    {key: 'ฃ', keyShifted: 'ฅ', latin: '\\'}
  ], [
    {key: 'ฟ', keyShifted: 'ฤ', latin: 'a'},
    {key: 'ห', keyShifted: 'ฆ', latin: 's'},
    {key: 'ก', keyShifted: 'ฏ', latin: 'd'},
    {key: 'ด', keyShifted: 'โ', latin: 'f'},
    {key: 'เ', keyShifted: 'ฌ', latin: 'g'},
    {key: '้', keyShifted: '็', latin: 'h'},
    {key: '่', keyShifted: '๋', latin: 'j'},
    {key: 'า', keyShifted: 'ษ', latin: 'k'},
    {key: 'ส', keyShifted: 'ศ', latin: 'l'},
    {key: 'ว', keyShifted: 'ซ', latin: ';'},
    {key: 'ง', keyShifted: '.', latin: '\''}
  ], [
    {key: 'ผ', keyShifted: '(', latin: 'z'},
    {key: 'ป', keyShifted: ')', latin: 'x'},
    {key: 'แ', keyShifted: 'ฉ', latin: 'c'},
    {key: 'อ', keyShifted: 'ฮ', latin: 'v'},
    {key: 'ิ', keyShifted: 'ฺ', latin: 'b'},
    {key: 'ื', keyShifted: '์', latin: 'n'},
    {key: 'ท', keyShifted: '?', latin: 'm'},
    {key: 'ม', keyShifted: 'ฒ', latin: ','},
    {key: 'ใ', keyShifted: 'ฬ', latin: '.'},
    {key: 'ฝ', keyShifted: 'ฦ', latin: '/'},
  ]
];
