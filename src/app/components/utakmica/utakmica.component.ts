import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Emitters } from 'src/app/emitters/emitters';
import { Tim } from 'src/app/models/tim';
import { AuthService } from 'src/app/services/auth.service';
import { FudbalskitimService } from 'src/app/services/fudbalskitim.service';
import { JwtService } from 'src/app/services/jwt.service';
import { KorisnikService } from 'src/app/services/korisnik.service';
import { loadTimovi } from 'src/app/store/igrac.action';
import { selectSviTimovi } from 'src/app/store/igrac.selector';

@Component({
  selector: 'app-utakmica',
  templateUrl: './utakmica.component.html',
  styleUrls: ['./utakmica.component.css']
})
export class UtakmicaComponent {
  trenutniTimID: number | null;
  trenutniKorisnikID: number | null;
  winner: Tim | null = null;
  trenutniTim: Tim | null = null;
  sviTimovi: Tim[] = [];
  trenutniKorisnik$: Observable<any> | undefined;
  brGolovaMi: number = 0;
  brGolovaProtivnik: number = 0;
  

  constructor(
    private store: Store<AppState>,
    private fudbalskitimService: FudbalskitimService,
    private authService: AuthService,
    private jwtService: JwtService,
    private korisnikService: KorisnikService
  ) {
    this.trenutniKorisnikID = null;
    this.trenutniTimID = null;
  }

  ngOnInit() {
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
            if (this.trenutniTimID)
              this.fudbalskitimService.getTimById(this.trenutniTimID).subscribe((nasTim) => {
                this.trenutniTim = nasTim;
              })
          }
          this.store.dispatch(loadTimovi());
          this.store.select(selectSviTimovi).subscribe((timovi) => {
            this.sviTimovi = timovi.filter((tim) => tim.id !== this.trenutniTimID);
          });
        })
      }
    }
  }

  generateRandomScore(min: number = 1, max: number = 9): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  simulateMatch(protivnikId: number) {
    if (this.trenutniTimID)
      this.fudbalskitimService.getTimById(this.trenutniTimID).subscribe((nasTim) => {
        this.fudbalskitimService.getTimById(protivnikId).subscribe((protivnikTim) => {
          this.fudbalskitimService.getIgraciByIds(nasTim.igraciTeren).subscribe((nasIgraci) => {
            this.fudbalskitimService.getIgraciByIds(protivnikTim.igraciTeren).subscribe((protivnikIgraci) => {
              const ukupnaOcenaNasihIgraca = nasIgraci.reduce((acc, igrac) => acc + igrac.ocena, 0);
              const ukupnaOcenaProtivnikovihIgraca = protivnikIgraci.reduce((acc, igrac) => acc + igrac.ocena, 0);

              let nereseno: Tim = {id:0, naziv:"Nereseno je",igraciTeren:[],igraciZamena:[] }

              let pobednik: Tim | null = null;
              let brGolovaMi: number = 0;
              let brGolovaProtivnik: number = 0;
              
              if (ukupnaOcenaNasihIgraca > ukupnaOcenaProtivnikovihIgraca) {
                pobednik = nasTim;
              } else if (ukupnaOcenaNasihIgraca < ukupnaOcenaProtivnikovihIgraca) {
                pobednik = protivnikTim;
              } else if (ukupnaOcenaNasihIgraca === ukupnaOcenaProtivnikovihIgraca) {
                pobednik = nereseno;
              }

              if (pobednik === nasTim) {
                while(brGolovaMi <= brGolovaProtivnik)
                {
                  brGolovaProtivnik = this.generateRandomScore();
                  brGolovaMi = this.generateRandomScore();
                }
               
              } else if (pobednik === protivnikTim) {
                while(brGolovaMi >= brGolovaProtivnik)
                {
                  brGolovaProtivnik = this.generateRandomScore();
                  brGolovaMi = this.generateRandomScore();
                }
              } else {
                const neresenoGolovi = this.generateRandomScore();
                brGolovaMi = neresenoGolovi;
                brGolovaProtivnik = neresenoGolovi;
              }

              this.brGolovaMi=brGolovaMi;
              this.brGolovaProtivnik=brGolovaProtivnik;
  
              console.log('Pobednik je: ', pobednik);
              console.log('Golovi za nas tim: ', brGolovaMi);
              console.log('Golovi za protivnički tim: ', brGolovaProtivnik);


              console.log('Pobednik je: ', pobednik);
              this.winner = pobednik;
            });
          });
        });
      });
  }

}
