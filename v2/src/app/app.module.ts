import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { SuggestionComponent } from './editor/suggestion/suggestion.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    SuggestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
