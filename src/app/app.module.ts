import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatInputModule, MatCardModule,
          MatIconModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AIComponent } from './components/ai/ai.component';

import { AIService } from './services/ai.service';

@NgModule({
  declarations: [
    AppComponent,
    AIComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [ AIService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
