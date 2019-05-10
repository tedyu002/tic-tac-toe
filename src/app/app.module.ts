import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TicTacToeComponentDefault, TicTacToeComponentOnPush, TicTacToeComponentOnPushCheck } from './tic-tac-toe/tic-tac-toe.component';

@NgModule({
  declarations: [
    AppComponent,
    TicTacToeComponentDefault,
    TicTacToeComponentOnPush,
    TicTacToeComponentOnPushCheck
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
