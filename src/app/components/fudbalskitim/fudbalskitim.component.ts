import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, filter, of } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Igrac } from 'src/app/models/igrac';
import { Tim } from 'src/app/models/tim';
import * as fromApp from 'src/app/store/igrac.selector';
import * as TimActions from 'src/app/store/igrac.action';
import { FudbalskitimService } from 'src/app/services/fudbalskitim.service';
import { selectIgraciZamena } from 'src/app/store/igrac.selector';
import { loadGolmani, loadIgraciZamena, loadNapadaci, loadOdbrambeni, loadVeznjaci } from 'src/app/store/igrac.action';
import { Emitters } from 'src/app/emitters/emitters';
import { AuthService } from 'src/app/services/auth.service';
import { JwtService } from 'src/app/services/jwt.service';
import { KorisnikService } from 'src/app/services/korisnik.service';


@Component({
  selector: 'app-fudbalskitim',
  templateUrl: './fudbalskitim.component.html',
  styleUrls: ['./fudbalskitim.component.css']
})
export class FudbalskitimComponent implements OnInit {
  trenutniKorisnik$: Observable<any> | undefined;
  trenutniTimID: number;
  trenutniKorisnikID: number | null;
  trenutniTim$: Observable<Tim | undefined> = of();
  igraciTeren$: Observable<Igrac[]> = of([]);
  igraciTerenIds$: Observable<number[]> = of([]);
  igraciZamenaIds$: Observable<Igrac[]> = of([]);
  igraciZamena$: Observable<Igrac[]> = of([]);
  golmani$: Observable<Igrac[]> = of([]);
  odbrambeni$: Observable<Igrac[]> = of([]);
  veznjaci$: Observable<Igrac[]> = of([]);
  napadaci$: Observable<Igrac[]> = of([]);

  selectedPlayerIdOut: number | null = null;
  selectedPlayerIdIn: number | null = null;
  authenticated = true;
  
  constructor(private store: Store<AppState>, private fudbalskitimService: FudbalskitimService, private authService: AuthService,
    private jwtService: JwtService, private korisnikService: KorisnikService) {
    this.igraciZamena$ = this.store.select(selectIgraciZamena)
    this.trenutniKorisnikID = null;
    this.trenutniTimID = 0

  }

  ngOnInit(): void {
    Emitters.authEmitter.emit(true);
    if (this.authService.isLoggedIn()) {
      const token = this.jwtService.getToken();
      if (token) {
        const decodedToken = atob(token.split('.')[1]);
        const parsedToken = JSON.parse(decodedToken);
        const userId = parsedToken.id;
        this.trenutniKorisnikID = userId;
        this.trenutniKorisnik$ = this.korisnikService.getKorisnikById(userId);

        this.trenutniKorisnik$.subscribe((korisnik) => {
          if (korisnik) {
            this.trenutniTimID = korisnik.timId;
            if (this.trenutniTimID) {
              this.store.dispatch(TimActions.loadIgraciZamena({ timID: this.trenutniTimID }));
               this.store.dispatch(TimActions.loadTimById({ timID: this.trenutniTimID }));
              this.store.dispatch(TimActions.loadIgraciTeren({ timID: this.trenutniTimID }));
              this.store.dispatch(TimActions.loadGolmani({ timID: this.trenutniTimID }));
              this.store.dispatch(TimActions.loadOdbrambeni({ timID: this.trenutniTimID }));
              this.store.dispatch(TimActions.loadVeznjaci({ timID: this.trenutniTimID }));
              this.store.dispatch(TimActions.loadNapadaci({ timID: this.trenutniTimID }));
            }
          }
        })

        this.store.pipe(
          select(fromApp.selectGolmani),
          filter(golmani => golmani.length > 0),
        ).subscribe(golmani => {
          this.golmani$ = of(golmani);
        });

        this.store.pipe(
          select(fromApp.selectOdbrambeni),
          filter(odbrambeni => odbrambeni.length > 0),
        ).subscribe(odbrambeni => {
          this.odbrambeni$ = of(odbrambeni);
        });

        this.store.pipe(
          select(fromApp.selectVeznjaci),
          filter(vezni => vezni.length > 0),
        ).subscribe(vezni => {
          this.veznjaci$ = of(vezni);
        });

        this.store.pipe(
          select(fromApp.selectNapadaci),
          filter(napadaci => napadaci.length > 0),
        ).subscribe(napadaci => {
          this.napadaci$ = of(napadaci);
        });

        this.store.pipe(
          select(fromApp.selectIgraciTeren),
          filter(igraciTeren => igraciTeren.length > 0),
        ).subscribe(igraciTeren => {
          this.igraciTeren$ = of(igraciTeren);
        });

        this.store.pipe(
          select(fromApp.selectIgraciZamena),
          filter(igraciZamena => igraciZamena.length > 0),
        ).subscribe(igraciZamena => {
          this.igraciZamena$ = of(igraciZamena);
        });


      }
    }

  }

  clickedUlazi(playerId: number) {
    this.selectedPlayerIdIn = playerId;
  }

  clickedIzlazi(playerId: number) {
    this.selectedPlayerIdOut = playerId;
  }



  swapPlayers() {
    if (this.selectedPlayerIdOut !== null && this.selectedPlayerIdIn !== null) {
      this.store.dispatch(
        TimActions.swapPlayers({
          timID: this.trenutniTimID,
          igracUlaziId: this.selectedPlayerIdIn,
          igracIzlaziId: this.selectedPlayerIdOut,
        })
      );

      this.selectedPlayerIdOut = null;
      this.selectedPlayerIdIn = null;
    }

  }


}
