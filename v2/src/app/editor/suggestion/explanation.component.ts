import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Lexicon } from 'lanna-utils';
import { ExtendedSuggestionResult } from './suggestion-result';

@Component({
  selector: 'pimlanna-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']
})
export class ExplanationComponent implements OnChanges {

  @Input() item?: ExtendedSuggestionResult;
  public relatives: string[] = [];
  public characters: string[] = [];
  private lexicon: Lexicon;

  constructor() {
    this.lexicon = new Lexicon();
  }

  ngOnChanges(_: SimpleChanges): void {
    if (!this.item) {
      this.characters = [];
      this.relatives = [];
      return;
    }
    this.characters = Array.from(this.item!.text);
    this.relatives = this.lexicon.getRelationship(this.item!.text).filter(x => x.text !== this.item!.text).map(x => x.text).slice(0, 10);
  }

}
