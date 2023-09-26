import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FudbalskitimComponent } from './components/fudbalskitim/fudbalskitim.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { igracReducer, korisnikReducer, timReducer } from './store/igrac.reducer';
import { IgracEffects, TimEffects } from './store/igrac.effects';
import { TransferiComponent } from './components/transferi/transferi.component';
import { UtakmicaComponent } from './components/utakmica/utakmica.component';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { KarticeComponent } from './components/kartice/kartice.component';
import { CookieService } from 'ngx-cookie-service';



@NgModule({
  declarations: [
    AppComponent,
    FudbalskitimComponent,
    TransferiComponent,
    UtakmicaComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    HomeComponent,
    KarticeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({ timovi: timReducer, igraci: igracReducer, korisnici: korisnikReducer }),
    EffectsModule.forRoot([TimEffects, IgracEffects]),
    FormsModule,
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true,
    }),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
