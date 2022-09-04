import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { getTaithamLayout, TaitthamKeyboardRow } from './keyboard-button';
import { KeyboardButtonComponent } from './keyboard-button.component';
import characters from 'lanna-utils/dist/resources/characters';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'pimlanna-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements AfterViewInit {
  @Input() suggested: boolean = false;
  @Input() suggestionSelected: boolean = false;
  @Input() rightShift: number = 0;
  @ViewChildren(KeyboardButtonComponent) keyboardButtonComponents!: KeyboardButtonComponent[];
  @Output() interact: EventEmitter<string> = new EventEmitter<string>();
  public layoutRows: TaitthamKeyboardRow[];
  public currentKey?: string;
  public componentsDict: {[key: string]: KeyboardButtonComponent} = {};
  public choeng: string = characters.signSakot;
  public leftShift: boolean = false;

  public get dark(): boolean {
    return this.themeService.darkMode;
  }

  constructor(
    private themeService: ThemeService
  ) {
    this.layoutRows = getTaithamLayout();
  }

  ngAfterViewInit(): void {
    this.componentsDict = this.keyboardButtonComponents
      .reduce<{[key: string]: KeyboardButtonComponent}>((obj, c) => ({
        ...obj,
        [c.keyButton.thai]: c,
        [c.keyButton.thaiShift]: c,
        [c.keyButton.latin]: c
      }), {});
  }

  private getKey(event: KeyboardEvent): string {
    if (event.key === 'Shift') {
      return (event.location === 1 ? 'Left' : 'Right') + 'Shift';
    }
    if ((event.key === 'Alt' || event.key === 'AltGraph') && event.location === 2) {
      return 'RightAlt';
    }
    return event.key;
  }

  public keyUp(event: KeyboardEvent) {
    const key = this.getKey(event);
    const component = this.componentsDict[key];
    if (component) {
      component.active = false;
    } else {
      this.currentKey = undefined;
    }
    if (key === 'LeftShift') {
      this.leftShift = false;
    }
  }
  
  public keyDown(event: KeyboardEvent) {
    const key = this.getKey(event);
    const component = this.componentsDict[key];
    if (component) {
      component.active = true;
    } else {
      this.currentKey = key;
    }
    if (key === 'LeftShift') {
      this.leftShift = true;
    }
  }

  public emit(event: string, resetLeftShift: boolean = true) {
    this.interact.emit(event);
    if (resetLeftShift) {
      this.leftShift = false;
    }
  }

}
