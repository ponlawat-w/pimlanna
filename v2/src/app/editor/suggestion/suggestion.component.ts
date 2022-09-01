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
  @Input() $textarea!: HTMLTextAreaElement;
  @Output() applied: EventEmitter<undefined> = new EventEmitter<undefined>();

  public suggestionResults: ExtendedSuggestionResult[] = [];
  public focusIndex: number = -1;

  private utilsLexicon: Lexicon;
  private utilsSuggestion: Suggestion;

  private get valid(): boolean {
    return this.position !== undefined && this.text !== undefined;
  }

  public get current(): ExtendedSuggestionResult|undefined {
    return this.suggestionResults.length > 0 && this.focusIndex > -1 && this.focusIndex < this.suggestionResults.length ?
      this.suggestionResults[this.focusIndex] : undefined;
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
        event.key === 'Escape' || event.key === 'Enter' || event.key === 'Shift'
      ))
    ) {
      event.preventDefault();
      return true;
    }
    return false;
  }

  public applyCurrent(processRemaining: boolean) {
    if (this.valid && this.focusIndex > -1 && this.focusIndex < this.suggestionResults.length) {
      const suggestion: ExtendedSuggestionResult = this.suggestionResults[this.focusIndex];
      suggestion.apply(this.$textarea);
      if (processRemaining && suggestion.remaining) {
        this.checkRemaining(suggestion);
      } else {
        this.applied.emit()
      }
    }
  }
  
  public keyUp(event: KeyboardEvent): boolean {
    if (!this.valid || !this.suggestionResults.length) {
      return false;
    }
    if (this.focusIndex < 0 && event.key === 'Tab') {
      this.focusIndex = 0;
      this.focusChanged();
      return true;
    }
    if (event.key === 'Escape') {
      this.$textarea.setSelectionRange(this.$textarea.selectionEnd, this.$textarea.selectionEnd);
      this.applied.emit();
    }
    if (event.key === 'ArrowRight' || (event.key === 'Tab' && !event.shiftKey)) {
      this.suggestionNext();
      return true;
    }
    if (event.key === 'ArrowLeft' || (event.key === 'Tab' && event.shiftKey)) {
      this.suggestionPrevious();
      return true;
    }
    if (event.key === 'Enter' && (this.focusIndex >= 0 && this.focusIndex < this.suggestionResults.length)) {
      this.applyCurrent(true);
    }
    return false;
  }

  public suggestionNext() {
    this.focusIndex = this.focusIndex >= this.suggestionResults.length - 1 ? 0 : this.focusIndex + 1;
    this.focusChanged();
  }

  public suggestionPrevious() {
    this.focusIndex = this.focusIndex <= 0 ? this.suggestionResults.length - 1 : this.focusIndex - 1;
    this.focusChanged();
  }

  public focusChanged() {
    if (this.focusIndex < 0 || this.focusIndex >= this.suggestionResults.length) {
      return;
    }
    const { selectionStart, selectionEnd } = this.suggestionResults[this.focusIndex];
    this.$textarea.setSelectionRange(selectionStart, selectionEnd);
  }

  public click(index: number) {
    this.focusIndex = index;
    this.focusChanged();
    this.applyCurrent(true);
    this.$textarea.focus();
  }

  private checkRemaining(suggestion: ExtendedSuggestionResult) {
    this.suggestionResults = this.utilsSuggestion.suggest(suggestion.remaining)
      .map(x => new ExtendedSuggestionResult(x, suggestion.remaining, this.$textarea.selectionStart));
    if (this.suggestionResults.length) {
      this.focusIndex = 0;
      this.focusChanged();
    }
  }

}
