import { SegmentExplanation } from 'lanna-utils/dist/segment-explanation';
import characters from 'lanna-utils/dist/resources/characters';

type Mapping = {
  result: string, float: boolean, choengable: boolean
};

const mappings: {[character: string]: Mapping} = {
  [characters.letterHighKa]: {result: 'ก', float: false, choengable: true},
  [characters.letterHighKha]: {result: 'ข', float: false, choengable: true},
  [characters.letterHighKxa]: {result: 'ฃ', float: false, choengable: true},
  [characters.letterLowKa]: {result: 'ค', float: false, choengable: true},
  [characters.letterLowKxa]: {result: 'ฅ', float: false, choengable: true},
  [characters.letterLowKha]: {result: 'ฆ', float: false, choengable: true},
  [characters.letterNga]: {result: 'ง', float: false, choengable: true},
  [characters.letterHighCa]: {result: 'จ', float: false, choengable: true},
  [characters.letterHighCha]: {result: 'ฉ', float: false, choengable: true},
  [characters.letterLowCa]: {result: 'ช', float: false, choengable: true},
  [characters.letterLowSa]: {result: 'ซ', float: false, choengable: true},
  [characters.letterLowCha]: {result: 'ฌ', float: false, choengable: true},
  [characters.letterNya]: {result: 'ญ', float: false, choengable: true},
  [characters.letterRata]: {result: 'ฏ', float: false, choengable: true},
  [characters.letterHighRatha]: {result: 'ฐ', float: false, choengable: true},
  [characters.letterDa]: {result: 'ด', float: false, choengable: true},
  [characters.letterLowRatha]: {result: 'ฒ', float: false, choengable: true},
  [characters.letterRana]: {result: 'ณ', float: false, choengable: true},
  [characters.letterHighTa]: {result: 'ต', float: false, choengable: true},
  [characters.letterHighTha]: {result: 'ถ', float: false, choengable: true},
  [characters.letterLowTa]: {result: 'ท', float: false, choengable: true},
  [characters.letterLowTha]: {result: 'ธ', float: false, choengable: true},
  [characters.letterNa]: {result: 'น', float: false, choengable: true},
  [characters.letterNa + characters.vowelSignAa]: {result: 'นา', float: false, choengable: false},
  [characters.letterBa]: {result: 'บ', float: false, choengable: true},
  [characters.letterHighPa]: {result: 'ป', float: false, choengable: true},
  [characters.letterHighPha]: {result: 'ผ', float: false, choengable: true},
  [characters.letterHighFa]: {result: 'ฝ', float: false, choengable: true},
  [characters.letterLowPa]: {result: 'พ', float: false, choengable: true},
  [characters.letterLowFa]: {result: 'ฟ', float: false, choengable: true},
  [characters.letterLowPha]: {result: 'ภ', float: false, choengable: true},
  [characters.letterMa]: {result: 'ม', float: false, choengable: true},
  [characters.letterLowYa]: {result: 'ย', float: false, choengable: true},
  [characters.letterHighYa]: {result: 'อย', float: false, choengable: true},
  [characters.letterRa]: {result: 'ร', float: false, choengable: true},
  [characters.letterRue]: {result: 'ฤ', float: false, choengable: true},
  [characters.letterLa]: {result: 'ล', float: false, choengable: true},
  [characters.letterLue]: {result: 'ฦ', float: false, choengable: true},
  [characters.letterWa]: {result: 'ว', float: false, choengable: true},
  [characters.letterHighSha]: {result: 'ศ', float: false, choengable: true},
  [characters.letterHighSsa]: {result: 'ษ', float: false, choengable: true},
  [characters.letterHighSa]: {result: 'ส', float: false, choengable: true},
  [characters.letterHighHa]: {result: 'ห', float: false, choengable: true},
  [characters.letterLla]: {result: 'ฬ', float: false, choengable: true},
  [characters.letterA]: {result: 'อ', float: false, choengable: true},
  [characters.letterLowHa]: {result: 'ฮ', float: false, choengable: true},
  [characters.letterI]: {result: 'อิ', float: false, choengable: false},
  [characters.letterIi]: {result: 'อี', float: false, choengable: false},
  [characters.letterU]: {result: 'อุ', float: false, choengable: false},
  [characters.letterUu]: {result: 'อู', float: false, choengable: false},
  [characters.letterEe]: {result: 'เอ', float: false, choengable: false},
  [characters.letterOo]: {result: 'โอ', float: false, choengable: false},
  [characters.letterLae]: {result: 'แล', float: false, choengable: true},
  [characters.letterGreatSa]: {result: 'สส', float: false, choengable: true},
  [characters.consonantSignMedialRa]: {result: 'ร', float: false, choengable: false},
  [characters.consonantSignMedialLa]: {result: 'ล', float: true, choengable: false},
  [characters.consonantSignLaTangLai]: {result: 'ล', float: true, choengable: false},
  [characters.signMaiKangLai]: {result: 'ง', float: true, choengable: false},
  [characters.consonantSignFinalNga]: {result: 'ง', float: true, choengable: false},
  [characters.consonantSignLowPa]: {result: 'พ', float: true, choengable: false},
  [characters.consonantSignHighRathaOrLowPa]: {result: 'พ', float: true, choengable: false},
  [characters.consonantSignMa]: {result: 'ม', float: true, choengable: false},
  [characters.consonantSignBa]: {result: 'บ', float: true, choengable: false},
  [characters.consonantSignSa]: {result: 'ส', float: true, choengable: false},
  [characters.signSakot]: {result: '?', float: false, choengable: false},
  [characters.vowelSignA]: {result: 'ะ', float: false, choengable: false},
  [characters.vowelSignMaiSat]: {result: 'ั', float: false, choengable: false},
  [characters.vowelSignAa]: {result: 'า', float: false, choengable: false},
  [characters.vowelSignTallAa]: {result: 'า', float: false, choengable: false},
  [characters.vowelSignI]: {result: 'ิ', float: false, choengable: false},
  [characters.vowelSignIi]: {result: 'ี', float: false, choengable: false},
  [characters.vowelSignUe]: {result: 'ึ', float: false, choengable: false},
  [characters.vowelSignUue]: {result: 'ื', float: false, choengable: false},
  [characters.vowelSignU]: {result: 'ุ', float: false, choengable: false},
  [characters.vowelSignUu]: {result: 'ู', float: false, choengable: false},
  [characters.vowelSignO]: {result: 'โ', float: true, choengable: false},
  [characters.vowelSignOaBelow]: {result: 'อ', float: true, choengable: false},
  [characters.vowelSignOy]: {result: 'ย', float: false, choengable: false},
  [characters.vowelSignE]: {result: 'เ', float: false, choengable: false},
  [characters.vowelSignAe]: {result: 'แ', float: false, choengable: false},
  [characters.vowelSignOo]: {result: 'โ', float: false, choengable: false},
  [characters.vowelSignAi]: {result: 'ไ', float: false, choengable: false},
  [characters.vowelSignThamAi]: {result: 'ใ', float: false, choengable: false},
  [characters.vowelSignOaAbove]: {result: 'อ', float: true, choengable: false},
  [characters.signMaiKang]: {result: 'ํ', float: false, choengable: false},
  [characters.signTone1]: {result: '่', float: false, choengable: false},
  [characters.signTone2]: {result: '้', float: false, choengable: false},
  [characters.signKhuenTone3]: {result: '่', float: false, choengable: false},
  [characters.signKhuenTone4]: {result: '้', float: false, choengable: false},
  [characters.signKhuenTone5]: {result: '๊', float: false, choengable: false},
  [characters.signRaHaam]: {result: '์', float: false, choengable: false},
  [characters.signMaiSam]: {result: 'ๆ', float: true, choengable: false},
  [characters.signKhuenLueKaran]: {result: '์', float: false, choengable: false},
  [characters.combiningCryptogrammicDot]: {result: 'ฺ', float: false, choengable: false},
  [characters.horaDigitZero]: {result: '๐', float: false, choengable: false},
  [characters.horaDigitOne]: {result: '๑', float: false, choengable: false},
  [characters.horaDigitTwo]: {result: '๒', float: false, choengable: false},
  [characters.horaDigitThree]: {result: '๓', float: false, choengable: false},
  [characters.horaDigitFour]: {result: '๔', float: false, choengable: false},
  [characters.horaDigitFive]: {result: '๕', float: false, choengable: false},
  [characters.horaDigitSix]: {result: '๖', float: false, choengable: false},
  [characters.horaDigitSeven]: {result: '๗', float: false, choengable: false},
  [characters.horaDigitEight]: {result: '๘', float: false, choengable: false},
  [characters.horaDigitNine]: {result: '๙', float: false, choengable: false},
  [characters.thamDigitZero]: {result: '๐', float: false, choengable: false},
  [characters.thamDigitOne]: {result: '๑', float: false, choengable: false},
  [characters.thamDigitTwo]: {result: '๒', float: false, choengable: false},
  [characters.thamDigitThree]: {result: '๓', float: false, choengable: false},
  [characters.thamDigitFour]: {result: '๔', float: false, choengable: false},
  [characters.thamDigitFive]: {result: '๕', float: false, choengable: false},
  [characters.thamDigitSix]: {result: '๖', float: false, choengable: false},
  [characters.thamDigitSeven]: {result: '๗', float: false, choengable: false},
  [characters.thamDigitEight]: {result: '๘', float: false, choengable: false},
  [characters.thamDigitNine]: {result: '๙', float: false, choengable: false},
  [characters.signWiang]: {result: '?', float: false, choengable: false},
  [characters.signWiangwaak]: {result: '?', float: false, choengable: false},
  [characters.signSawan]: {result: '?', float: false, choengable: false},
  [characters.signKeow]: {result: '?', float: false, choengable: false},
  [characters.signHoy]: {result: '?', float: false, choengable: false},
  [characters.signDokmai]: {result: '?', float: false, choengable: false},
  [characters.signReversedRotatedRana]: {result: '?', float: false, choengable: false},
  [characters.signMaiYamok]: {result: 'ๆ', float: false, choengable: false},
  [characters.signKaan]: {result: '?', float: false, choengable: false},
  [characters.signKaankuu]: {result: '?', float: false, choengable: false},
  [characters.signSatkaan]: {result: 'ฯ', float: false, choengable: false},
  [characters.signSatkaankuu]: {result: '๚', float: false, choengable: false},
  [characters.signHang]: {result: '?', float: false, choengable: false},
  [characters.signCaang]: {result: '?', float: false, choengable: false}
};

export class ThaiExplanation {
  segmentExplanation: SegmentExplanation;

  public inlineBlock: string = '';
  public floatTop: string[] = [];
  public floatBottom: string[] = [];
  public floatBottomRight: string[] = [];
  public floatTopRight: string[] = [];

  constructor(segmentExplantion: SegmentExplanation) {
    this.segmentExplanation = segmentExplantion;
    if (!this.segmentExplanation.valid) {
      return;
    }
    this.processAllInline(this.segmentExplanation.left);
    this.processCentralLeft();
    this.processCentral();
    this.processWithFloat(segmentExplantion.bottom, this.floatBottom);
    this.processWithFloat(segmentExplantion.top, this.floatTop);
    this.processAllInline(this.segmentExplanation.right, true);
    this.processWithFloat(segmentExplantion.rightBottom, this.floatBottomRight);
    this.processWithFloat(segmentExplantion.rightTop, this.floatTopRight);
  }

  getMapping(char: string): Mapping {
    return mappings[char] ?? {result: '?', float: false};
  }

  processAllInline(explanation: string, right: boolean = false) {
    if (right && this.segmentExplanation.central === characters.letterNa + characters.vowelSignAa) {
      this.inlineBlock += this.getMapping(characters.vowelSignAa).result;
    }
    this.inlineBlock += Array.from(explanation).map(x => this.getMapping(x).result).filter(x => x !== '?').join('');
  }

  processCentralLeft() {
    for (const char of this.segmentExplanation.centralLeft) {
      this.inlineBlock += `<span class="central-left">${this.getMapping(char).result}</span>`;
    }
  }
  
  processCentral() {
    if (this.segmentExplanation.central === characters.letterNa + characters.vowelSignAa) {
      this.inlineBlock += this.getMapping(characters.letterNa).result;
      return;
    }
    this.inlineBlock += this.getMapping(this.segmentExplanation.central).result;
  }

  processWithFloat(explanation: string, floatArray: string[]) {
    for (const char of explanation) {
      const mapping = this.getMapping(char);
      if (mapping.result === '?') {
        continue;
      }
      if (mapping.float || mapping.choengable) {
        floatArray.push(mapping.result);
      } else {
        this.inlineBlock += mapping.result;
      }
    }
  }
}
