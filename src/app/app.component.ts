import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'pimlanna-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pimlanna';

  constructor(
    private themeService: ThemeService
  ) {
    this.applyBodyClass();
    this.themeService.modeChanged.subscribe(_ => this.applyBodyClass());
  }

  applyBodyClass() {
    document.body.classList.remove(this.themeService.darkMode ? 'light' : 'dark');
    document.body.classList.add(this.themeService.darkMode ? 'dark' : 'light');
  }
}
