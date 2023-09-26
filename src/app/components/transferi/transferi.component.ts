import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, filter, of, take } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Emitters } from 'src/app/emitters/emitters';
import { Igrac } from 'src/app/models/igrac';
import { Korisnik } from 'src/app/models/korisnik';
import { AuthService } from 'src/app/services/auth.service';
import { FudbalskitimService } from 'src/app/services/fudbalskitim.service'
import { JwtService } from 'src/app/services/jwt.service';
import { KorisnikService } from 'src/app/services/korisnik.service';
import { addIgracToZamene, addKupljeniIgracURoster, buyIgrac, loadIgraciZamena, loadTrenutniKorisnik, removeIgracIzTransferLista, updateIgraciTransferLista } from 'src/app/store/igrac.action';
import { selectIgraciTransferLista, selectIgraciZamena, selectKorisnikIdZaBrisanje, selectTrenutniKorisnik } from 'src/app/store/igrac.selector';
import * as fromApp from 'src/app/store/igrac.selector';

@Component({
  selector: 'app-transferi',
  templateUrl: './transferi.component.html',
  styleUrls: ['./transferi.component.css']
})
export class TransferiComponent implements OnInit {
 
  trenutniKorisnikID: number | undefined;
  trenutniKorisnik$: Observable<Korisnik>;
  igraciTransferLista$: Observable<Igrac[]>;
  igraciTransferLista: any[] = [];
  igraciZamena$: Observable<Igrac[]> = of([]);
  trenutniTimID:number;  


  constructor(
    private store: Store<AppState>,
    private fudbalskiTimService: FudbalskitimService,
    private korisnikService: KorisnikService,
    private authService:AuthService,
    private jwtService:JwtService,
  ) {
    this.trenutniKorisnik$ = this.store.select(selectTrenutniKorisnik);
    this.igraciTransferLista$ = this.store.select(selectIgraciTransferLista);
    this.igraciZamena$ = this.store.select(selectIgraciZamena);
    this.trenutniTimID = 0;

  }
  
  ngOnInit() {
    Emitters.authEmitter.emit(true);
    
    this.trenutniKorisnik$ = this.store.pipe(select(selectTrenutniKorisnik));
    if (this.authService.isLoggedIn()) {
      const token = this.jwtService.getToken();
      if (token) {
        const decodedToken = atob(token.split('.')[1]);
        const parsedToken = JSON.parse(decodedToken);
        const userId = parsedToken.id;
        this.trenutniKorisnikID = userId;
    
        this.trenutniKorisnik$ = this.korisnikService.getKorisnikById(userId);
        this.store.dispatch(loadTrenutniKorisnik({ korisnikId: userId }));

    this.fudbalskiTimService.getIgraciTransferLista().subscribe(data => {
      this.igraciTransferLista = data;
    }),

  
    this.igraciTransferLista$.subscribe(igraci => {
      this.igraciTransferLista = igraci;
    });
  }
}
}
  


kupiIgraca(igrac: any) {
  this.trenutniKorisnik$.pipe(
    take(1)
  ).subscribe(trenutniKorisnik => {
    if (trenutniKorisnik?.virtuelniNovac && trenutniKorisnik.virtuelniNovac >= igrac.cena) {
      const noviIgraciTransferLista = this.igraciTransferLista.filter(i => i.id !== igrac.id); // igrac.id je id iz IgraciTransferLista!
      this.fudbalskiTimService.getLastAddedIgracId().pipe(
        take(1)
      ).subscribe(lastAddedIgracId => {
        if (lastAddedIgracId) {
          const noviId = lastAddedIgracId + 1;

          this.store.dispatch(buyIgrac({ igrac }));
          this.store.dispatch(removeIgracIzTransferLista({ igracId: igrac.id }));
          this.store.dispatch(updateIgraciTransferLista({ igraci: noviIgraciTransferLista }));
          this.store.dispatch(addKupljeniIgracURoster({ kupljeniIgrac: igrac, ciljaniTimId: trenutniKorisnik.timId }));
          this.store.dispatch(addIgracToZamene({ timId: trenutniKorisnik.timId, igracId: noviId })); 
      
      }
    });
    } else {
      console.log('Nemas dovoljno novca za kupovinu.');
    }
  });
}
  
}
