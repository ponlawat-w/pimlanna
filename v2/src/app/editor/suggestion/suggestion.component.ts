import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Lexicon, Suggestion } from 'lanna-utils';
import { ExtendedSuggestionResult } from './suggestion-result';

@Component({
  selector: 'pimlanna-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnChanges {

  @Input() position?: number;
  @Input() text?: string;
  @Output() applied: EventEmitter<undefined> = new EventEmitter<undefined>();

  public suggestionResults: ExtendedSuggestionResult[] = [];
  public focusIndex: number = -1;

  private utilsLexicon: Lexicon;
  private utilsSuggestion: Suggestion;

  private get valid(): boolean {
    return this.position !== undefined && this.text !== undefined;
  }

  constructor() {
    this.utilsLexicon = new Lexicon();
    this.utilsSuggestion = new Suggestion(this.utilsLexicon);
    this.utilsSuggestion.returnCount = 20;
    this.utilsSuggestion.searchCount = 100;
  }

  ngOnChanges(_: SimpleChanges) {
    if (!this.valid) {
      this.focusIndex = -1;
      this.suggestionResults = [];
      return;
    }
    this.focusIndex = -1;
    this.suggestionResults = this.utilsSuggestion.suggest(this.text!)
      .map(x => new ExtendedSuggestionResult(x, this.text!, this.position!));
  }

  public keyDown(event: KeyboardEvent): boolean {
    if (!this.valid || !this.suggestionResults.length) {
      return false;
    }
    if (this.focusIndex < 0 && event.key === 'Tab') {
      event.preventDefault();
      return true;
    }
    if (
      event.key == 'ArrowLeft' || event.key === 'ArrowRight'
      || event.key === 'Tab'
      || (this.focusIndex > -1 && (
        event.key === ' ' || event.key === 'Escape' || event.key === 'Enter' || event.key === 'Shift'
      ))
    ) {
      event.preventDefault();
      return true;
    }
    return false;
  }

  public applyCurrent($textarea: HTMLTextAreaElement) {
    if (this.valid && this.focusIndex > -1 && this.focusIndex < this.suggestionResults.length) {
      this.suggestionResults[this.focusIndex].apply($textarea);
    }
  }
  
  public keyUp(event: KeyboardEvent, $textarea: HTMLTextAreaElement): boolean {
    if (!this.valid || !this.suggestionResults.length) {
      return false;
    }
    if (this.focusIndex < 0 && event.key === 'Tab') {
      this.focusIndex = 0;
      this.focusChanged($textarea);
      return true;
    }
    if (event.key === 'Escape') {
      $textarea.setSelectionRange($textarea.selectionEnd, $textarea.selectionEnd);
      this.applied.emit();
    }
    if (event.key === 'ArrowRight' || (event.key === 'Tab' && !event.shiftKey)) {
      this.focusIndex = this.focusIndex >= this.suggestionResults.length - 1 ? 0 : this.focusIndex + 1;
      this.focusChanged($textarea);
      return true;
    }
    if (event.key === 'ArrowLeft' || (event.key === 'Tab' && event.shiftKey)) {
      this.focusIndex = this.focusIndex <= 0 ? this.suggestionResults.length - 1 : this.focusIndex - 1;
      this.focusChanged($textarea);
      return true;
    }
    if (
      (event.key === 'Enter' || event.key === ' ')
      && (this.focusIndex >= 0 && this.focusIndex < this.suggestionResults.length)
    ) {
      const suggestion: ExtendedSuggestionResult = this.suggestionResults[this.focusIndex];
      suggestion.apply($textarea);
      if (suggestion.remaining) {
        this.checkRemaining(suggestion, $textarea);
      } else {
        this.applied.emit()
      }
    }
    return false;
  }

  public focusChanged($textarea: HTMLTextAreaElement) {
    if (this.focusIndex < 0 || this.focusIndex >= this.suggestionResults.length) {
      return;
    }
    const { selectionStart, selectionEnd } = this.suggestionResults[this.focusIndex];
    $textarea.setSelectionRange(selectionStart, selectionEnd);
  }

  private checkRemaining(suggestion: ExtendedSuggestionResult, $textarea: HTMLTextAreaElement) {
    this.suggestionResults = this.utilsSuggestion.suggest(suggestion.remaining)
      .map(x => new ExtendedSuggestionResult(x, suggestion.remaining, $textarea.selectionStart));
    if (this.suggestionResults.length) {
      this.focusIndex = 0;
      this.focusChanged($textarea);
    }
  }

}
