import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Lexicon, Suggestion, textSegment } from 'lanna-utils';
import { ThemeService } from 'src/app/theme.service';
import { ExtendedSuggestionResult } from './suggestion-result';

@Component({
  selector: 'pimlanna-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnChanges {

  @Input() segmentExplanationEnabled: boolean = true;
  @Input() position?: number;
  @Input() text?: string;
  @Input() $textarea!: HTMLTextAreaElement;
  @Output() applied: EventEmitter<undefined> = new EventEmitter<undefined>();

  public lastExactResult?: ExtendedSuggestionResult;
  public suggestionResults: ExtendedSuggestionResult[] = [];
  public focusIndex: number = -1;

  private utilsLexicon: Lexicon;
  private utilsSuggestion: Suggestion;

  public get valid(): boolean {
    return this.position !== undefined && this.text !== undefined;
  }

  public get current(): ExtendedSuggestionResult|undefined {
    return this.suggestionResults.length > 0 && this.focusIndex > -1 && this.focusIndex < this.suggestionResults.length ?
      this.suggestionResults[this.focusIndex] : undefined;
  }

  public get dark(): boolean {
    return this.themeService.darkMode;
  }

  constructor(
    private themeService: ThemeService
  ) {
    this.utilsLexicon = new Lexicon();
    this.utilsSuggestion = new Suggestion(this.utilsLexicon);
    this.utilsSuggestion.returnCount = 10;
    this.utilsSuggestion.searchCount = 200;
  }

  ngOnChanges(_: SimpleChanges) {
    if (!this.valid) {
      this.focusIndex = -1;
      this.suggestionResults = [];
      this.lastExactResult = undefined;
      this.$textarea.setSelectionRange(this.$textarea.selectionEnd, this.$textarea.selectionEnd);
      this.applied.emit();
      return;
    }
    this.focusIndex = -1;
    this.suggest(this.text!, this.position!);
  }
  
  suggest(text: string, position: number) {
    this.suggestionResults = this.utilsSuggestion.suggest(text)
      .map(x => new ExtendedSuggestionResult(x, text, position));
    const exacts = this.suggestionResults.filter(x => x.text === text);
    if (exacts.length) {
      this.lastExactResult = exacts[0];
    }
    if (this.lastExactResult) {
      this.updateLastExactResultRemaining(text, position);
    }
    if (!this.lastExactResult) {
      return;
    }
    const lastExactResultIndex = this.suggestionResults.map(x => x.text)
      .indexOf(this.lastExactResult!.text);
    if (lastExactResultIndex > -1) {
      this.suggestionResults.splice(lastExactResultIndex, 1);
    }
    this.suggestionResults = [this.lastExactResult, ...this.suggestionResults];
  }

  updateLastExactResultRemaining(text: string, position: number) {
    if (!text.startsWith(this.lastExactResult!.text)) {
      this.lastExactResult = undefined;
      return;
    }
    this.lastExactResult = new ExtendedSuggestionResult(
      {text: this.lastExactResult!.text, remaining: text.substring(this.lastExactResult!.text.length)},
      text, position
    );
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
      this.lastExactResult = undefined;
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
      this.suggestionReject();
      return true;
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

  public suggestionReject() {
    this.$textarea.setSelectionRange(this.$textarea.selectionEnd, this.$textarea.selectionEnd);
    if (this.current && this.current.remaining) {
      this.checkRemaining(this.current);
    } else {
      this.applied.emit();
    }
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
    const remainingSegments = textSegment(suggestion.remaining);
    for (let i = 1; i <= remainingSegments.length; i++) {
      const checkSegments = remainingSegments.slice(0, i);
      this.suggest(checkSegments.join(''), this.$textarea.selectionStart);
    }
    if (this.suggestionResults.length) {
      this.focusIndex = 0;
      this.focusChanged();
    }
  }

}