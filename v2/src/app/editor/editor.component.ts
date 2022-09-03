import { Component, ElementRef, ViewChild } from '@angular/core';
import { getKeyDict, KeyDict, keys } from 'src/keys';
import Characters from 'lanna-utils/dist/resources/characters';
import Patterns from 'lanna-utils/dist/resources/patterns';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { KeyboardComponent } from './keyboard/keyboard.component';

type EditorOptions = {
  virtualKeyboard: boolean,
  mobile: boolean,
  suggestions: boolean
};

@Component({
  selector: 'pimlanna-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  public rShift: number = 0;
  public options: EditorOptions = {
    virtualKeyboard: true,
    mobile: false,
    suggestions: true
  };
  public suggestionPosition?: number;
  public suggestionInput?: string;
  private keyDownPosition?: number;
  private keyInDictPressed: boolean = false;
  private keyDict: KeyDict;
  private maxRShift: number;
  private spatialCharactersPattern: string = `[${Patterns.spatialCharacters}]`;

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild(SuggestionComponent) suggestionComponent?: SuggestionComponent;
  @ViewChild(KeyboardComponent) keyboardComponent?: KeyboardComponent;

  constructor() {
    this.keyDict = getKeyDict();
    this.maxRShift = keys.reduce((max, key) => Math.max(max, key.rShiftCount), 0);
  }

  public get $textarea(): HTMLTextAreaElement {
    return this.textarea.nativeElement;
  }

  public get suggested(): boolean {
    return this.suggestionInput && this.suggestionComponent
      && this.suggestionComponent.valid && this.suggestionComponent.suggestionResults.length > 0 ? true : false;
  }

  private get textAreaSelectionStart(): number {
    return this.$textarea.selectionStart;
  }

  addToText(character: string) {
    const selectionStart = this.$textarea.selectionStart;
    const selectionEnd = this.$textarea.selectionEnd;
    this.$textarea.value = this.$textarea.value.substring(0, selectionStart)
      + character
      + this.$textarea.value.substring(selectionEnd, this.$textarea.value.length);
    this.$textarea.setSelectionRange(selectionStart + character.length, selectionStart + character.length);
    if (this.options.suggestions) {
      if (this.suggestionPosition === undefined && new RegExp(this.spatialCharactersPattern).test(character)) {
        this.suggestionPosition = selectionStart;
        this.suggestionInput = '';
      }
      this.suggestionInput += character;
    }
    this.rShift = 0;
  }

  keyPress(event: KeyboardEvent) {
    const pressedKey = event.key;
    if (this.keyDict[pressedKey]) {
      const key: string = this.keyDict[pressedKey][this.rShift] ?? undefined;
      if (!key) {
        if (this.rShift) {
          this.rShift = 0;
          event.preventDefault();
        }
        this.clearSuggestionInput();
        return;
      }
      event.preventDefault();
      this.rShift = 0;
      this.keyInDictPressed = true;
      return this.addToText(key);
    }
    this.clearSuggestionInput();
  }

  keyDown(event: KeyboardEvent) {
    this.keyboardComponent && this.keyboardComponent.keyDown(event);
    if (this.suggestionComponent &&  this.suggestionComponent.keyDown(event)) {
      return;
    }
    this.keyInDictPressed = false;
    this.keyDownPosition = this.textAreaSelectionStart;
    if (this.$textarea.selectionStart !== this.$textarea.selectionEnd) {
      if ((this.keyDict[event.key] || event.key === ' ') && this.suggestionComponent && this.suggestionComponent.focusIndex > -1) {
        this.suggestionComponent.applyCurrent(false);
      }
      this.clearSuggestionInput();
    }
  }
  
  keyUp(event: KeyboardEvent) {
    this.keyboardComponent && this.keyboardComponent.keyUp(event);
    if (event.key === 'Shift' && (event.location === 0 || event.location === 2)) {
      event.preventDefault();
      this.addRightShift();
    } else if ((event.key === 'Alt' || event.key === 'AltGraph') && event.location === 2) {
      event.preventDefault();
      this.addToText(Characters.signSakot);
    } else if (event.key === 'Backspace') {
      this.processBacksapce();
    } else if (event.key === 'Delete') {
      event.preventDefault();
      this.clearSuggestionInput();
    } else if (this.suggestionComponent && this.suggestionComponent.keyUp(event)) {
      return;
    } else if (event.key === 'Escape' && this.suggestionInput) {
      event.preventDefault();
      this.clearSuggestionInput();
    } else if (!this.keyInDictPressed && this.keyDownPosition !== undefined && this.keyDownPosition !== this.textAreaSelectionStart) {
      this.clearSuggestionInput();
    }
  }

  addRightShift() {
    this.rShift++;
    if (this.rShift > this.maxRShift) {
      this.rShift = 0;
    }
  }

  processBacksapce() {
    if (this.suggestionPosition === undefined || this.suggestionInput === undefined) {
      return;
    }
    if (this.textAreaSelectionStart <= this.suggestionPosition) {
      return this.clearSuggestionInput();
    }
    const newLength = this.textAreaSelectionStart - this.suggestionPosition;
    this.suggestionInput = this.suggestionInput.substring(0, newLength);
  }

  public clearSuggestionInput() {
    this.suggestionPosition = undefined;
    this.suggestionInput = undefined;
  }

  public virtualKeyboardInteracted(event: string) {
    this.$textarea.focus();
    if (event === 'Backspace') {
      if (this.$textarea.selectionStart > 0) {
        let newSelection = this.$textarea.selectionStart - 1;
        this.$textarea.value = this.$textarea.value.substring(0, this.$textarea.selectionStart - 1)
          + this.$textarea.value.substring(this.$textarea.selectionEnd);
        this.$textarea.setSelectionRange(newSelection, newSelection);
        this.processBacksapce();
      }
    } else if (event === 'RightShift') {
      this.addRightShift();
    } else if (event === 'SuggestionNext') {
      this.suggestionComponent ? this.suggestionComponent.suggestionNext() : undefined;
    } else if (event === 'SuggestionPrevious') {
      this.suggestionComponent ? this.suggestionComponent.suggestionPrevious() : undefined;
    } else if (event === 'SuggestionTake') {
      this.suggestionComponent ? this.suggestionComponent.applyCurrent(true) : undefined;
    } else if (event === 'SuggestionReject') {
      this.clearSuggestionInput();
    } else {
      this.addToText(event);
    }
  }

}
