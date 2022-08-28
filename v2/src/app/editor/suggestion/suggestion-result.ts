import { SuggestionResult } from 'lanna-utils/dist/suggest';

export class ExtendedSuggestionResult implements SuggestionResult {
  public focus: boolean = false;
  public readonly remaining: string;
  public readonly text: string;
  public readonly selectionStart: number;
  public readonly selectionEnd: number;

  public constructor(result: SuggestionResult, input: string, position: number) {
    this.text = result.text;
    this.remaining = result.remaining;
    this.selectionStart = position;
    this.selectionEnd = position + input.length - this.remaining.length;
  }

  public apply($textarea: HTMLTextAreaElement) {
    $textarea.value = $textarea.value.substring(0, this.selectionStart)
      + this.text + $textarea.value.substring(this.selectionEnd);
    $textarea.setSelectionRange(this.selectionStart + this.text.length, this.selectionStart + this.text.length);
  }
}
