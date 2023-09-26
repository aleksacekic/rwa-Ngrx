import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  loadTimById,
  loadIgraciTeren,
  loadGolmani,
  loadOdbrambeni,
  loadVeznjaci,
  loadNapadaci,
  loadTrenutniKorisnik,
} from './store/igrac.action';
import { KorisnikService } from './services/korisnik.service';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import { Igrac } from './models/igrac';
import { AppState } from './app.state';
import { selectIgraciZamena } from './store/igrac.selector';
import { Emitters } from './emitters/emitters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  trenutniTimID: number | undefined;
  trenutniKorisnik$: Observable<any> | undefined;
  trenutniKorisnikID: number | null;
  igraciZamena$: Observable<Igrac[]> = of([]);

  constructor(
    private store: Store<AppState>,
    private korisnikService: KorisnikService,
    private authService: AuthService,
    private jwtService: JwtService,
    
  ) {

    this.trenutniKorisnikID = null; 
  }

  ngOnInit(): void {}


  title = 'AngularProjekat';
}
