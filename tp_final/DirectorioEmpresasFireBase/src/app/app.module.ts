import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';

export const firebaseConfig = {
  apiKey: "AIzaSyAf_LM_hH28h-FVezIh40XFQtg60lkzcw4",
  authDomain: "directorioempresas-74f45.firebaseapp.com",
  databaseURL: "https://directorioempresas-74f45.firebaseio.com",
  storageBucket: "directorioempresas-74f45.appspot.com",
  messagingSenderId: "384507057866"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
