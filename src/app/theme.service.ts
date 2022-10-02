import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode: boolean = false;
  public modeChanged: Subject<boolean> = new Subject<boolean>();
  watching: boolean = false;

  constructor() {
    this.checkThemeMode();
    if (!this.watching) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.checkThemeMode();
      });
      this.watching = true;
    }
  }

  checkThemeMode() {
    const current = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (current !== this.darkMode) {
      this.darkMode = current;
      this.modeChanged.next(this.darkMode);
    }
  }
}
