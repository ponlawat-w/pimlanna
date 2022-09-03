import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Lexicon, segmentExplanation, textSegment } from 'lanna-utils';
import { SegmentExplanation } from 'lanna-utils/dist/segment-explanation';
import { ExtendedSuggestionResult } from './suggestion-result';

@Component({
  selector: 'pimlanna-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']
})
export class ExplanationComponent implements OnChanges {

  @Input() segmentExplanationEnabled: boolean = true;
  @Input() item?: ExtendedSuggestionResult;
  public relatives: string[] = [];
  public characters: string[] = [];
  public segmentExplanations: SegmentExplanation[] = [];
  private lexicon: Lexicon;

  constructor() {
    this.lexicon = new Lexicon();
  }

  ngOnChanges(_: SimpleChanges): void {
    if (!this.item) {
      this.characters = [];
      this.relatives = [];
      this.segmentExplanations = [];
      return;
    }
    this.characters = Array.from(this.item!.text);
    this.relatives = this.lexicon.getRelationship(this.item!.text).filter(x => x.text !== this.item!.text).map(x => x.text).slice(0, 10);
    this.explainSegments();
  }

  explainSegments() {
    const segments = textSegment(this.item!.text);
    const segmentExplanations = segments.map(x => segmentExplanation(x));
    if (segmentExplanations.filter(x => !x.valid).length) {
      this.segmentExplanations = [];
      return;
    }
    this.segmentExplanations = segmentExplanations;
  }

}
