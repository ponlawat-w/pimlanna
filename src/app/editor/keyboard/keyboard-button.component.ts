import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaithamKeyboardButton } from './keyboard-button';

@Component({
  selector: 'pimlanna-keyboard-button',
  templateUrl: './keyboard-button.component.html',
  styleUrls: ['./keyboard-button.component.css']
})
export class KeyboardButtonComponent {

  @Input() keyButton?: TaithamKeyboardButton;
  @Input() leftShift: boolean = false;
  @Input() rightShift: number = 0;
  @Output() interact: EventEmitter<string> = new EventEmitter();
  public active: boolean = false;

  public get latin(): string {
    return this.keyButton?.latin ?? '';
  }

  public get taitham(): string {
    return this.keyButton?.taitham[this.rightShift] ?? '';
  }

  public get taithamShift(): string {
    return this.keyButton?.taithamShift[this.rightShift] ?? '';
  }

  public get current(): string {
    if (!this.keyButton) {
      return '';
    }
    return (this.leftShift ? this.keyButton.taithamShift[this.rightShift] : this.keyButton.taitham[this.rightShift]) ?? '';
  }

  constructor() {}

}
