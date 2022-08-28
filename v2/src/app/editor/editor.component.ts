import { Component, ElementRef, ViewChild } from '@angular/core';
import { getKeyDict, KeyDict, keys } from 'src/keys';
import Characters from 'lanna-utils/dist/resources/characters';
import Patterns from 'lanna-utils/dist/resources/patterns';
import { SuggestionComponent } from './suggestion/suggestion.component';

@Component({
  selector: 'pimlanna-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  public rShift: number = 0;
  public suggestionPosition?: number;
  public suggestionInput?: string;
  private keyDownPosition?: number;
  private keyInDictPressed: boolean = false;
  private keyDict: KeyDict;
  private maxRShift: number;
  private spatialCharactersPattern: string = `[${Patterns.spatialCharacters}]`;

  @ViewChild('textarea') textarea!: ElementRef;
  @ViewChild(SuggestionComponent) suggestionComponent!: SuggestionComponent;

  constructor() {
    this.keyDict = getKeyDict();
    this.maxRShift = keys.reduce((max, key) => Math.max(max, key.rShiftCount), 0);
  }

  private get $textarea(): HTMLTextAreaElement {
    return this.textarea.nativeElement as HTMLTextAreaElement;
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
    if (this.suggestionPosition === undefined && new RegExp(this.spatialCharactersPattern).test(character)) {
      this.suggestionPosition = selectionStart;
      this.suggestionInput = '';
    }
    this.suggestionInput += character;
  }

  keyPress(event: KeyboardEvent) {
    const pressedKey = event.key;
    if (this.keyDict[pressedKey]) {
      const key: string = this.keyDict[pressedKey][this.rShift] ?? this.keyDict[pressedKey][0];
      if (!key) {
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
    if (this.suggestionComponent.keyDown(event)) {
      return;
    }
    this.keyInDictPressed = false;
    this.keyDownPosition = this.textAreaSelectionStart;
    if (this.$textarea.selectionStart !== this.$textarea.selectionEnd) {
      if (this.suggestionComponent.focusIndex > -1) {
        this.suggestionComponent.applyCurrent(this.$textarea);
      }
      this.clearSuggestionInput();
    }
  }
  
  keyUp(event: KeyboardEvent) {
    if (event.key === 'Shift' && (event.location === 0 || event.location === 2)) {
      event.preventDefault();
      this.rShift++;
      if (this.rShift > this.maxRShift) {
        this.rShift = 0;
      }
    } else if ((event.key === 'Alt' || event.key === 'AltGraph') && event.location === 2) {
      event.preventDefault();
      this.addToText(Characters.signSakot);
    } else if (event.key === 'Backspace') {
      this.processBacksapce();
    } else if (event.key === 'Escape' || event.key === 'Delete') {
      event.preventDefault();
      this.clearSuggestionInput();
    } else if (this.suggestionComponent.keyUp(event, this.$textarea)) {
      return;
    } else if (!this.keyInDictPressed && this.keyDownPosition !== undefined && this.keyDownPosition !== this.textAreaSelectionStart) {
      this.clearSuggestionInput();
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

}
