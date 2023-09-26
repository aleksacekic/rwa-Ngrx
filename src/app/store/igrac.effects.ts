import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { FudbalskitimService } from '../services/fudbalskitim.service';
import * as TimActions from 'src/app/store/igrac.action';
import * as IgracActions from 'src/app/store/igrac.action';
import { Igrac } from '../models/igrac';
import * as fromApp from './igrac.selector';
import { Store, select } from '@ngrx/store';
import { selectIgraciTeren, selectIgraciTransferLista, selectIgraciZamena, selectSveState, selectTimState, selectTrenutniKorisnik } from './igrac.selector';
import { AppState } from '../app.state';
import { KorisnikService } from '../services/korisnik.service';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class TimEffects {
  constructor(
    private actions$: Actions,
    private fudbalskiTimService: FudbalskitimService,
    private store: Store<AppState>,
    private korisnikService: KorisnikService,
  ) { }

  addIgracToZamene$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IgracActions.addIgracToZamene),
      mergeMap((action) =>
        this.fudbalskiTimService.dodajIgracaZamenama( action.igracId, action.timId).pipe(
          map(() => IgracActions.addIgracToZameneSuccess({  igracId: action.igracId, timId: action.timId})),
          catchError(() => of(IgracActions.addIgracToZameneFailed()))
        )
      )
    )
  );

  addKupljeniIgracURoster$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TimActions.addKupljeniIgracURoster),
    switchMap((action) =>
      this.fudbalskiTimService.dodajIgracaUListuIgraca(action.kupljeniIgrac, action.ciljaniTimId).pipe(
        map(() => IgracActions.addKupljeniIgracSuccess({
          kupljeniIgrac: { ...action.kupljeniIgrac, timId: action.ciljaniTimId },
          azuriraniIdTima: action.ciljaniTimId
        })),
        catchError(() => of(IgracActions.addKupljeniIgracFailed()))
      )
    )
  )
);


  buyIgrac$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TimActions.buyIgrac),
    withLatestFrom(
      this.store.select(selectTrenutniKorisnik),
      this.store.select(selectIgraciTransferLista)
    ),
    mergeMap(([action, trenutniKorisnik]) => {
      if (!trenutniKorisnik) {
        return of(IgracActions.buyIgracFailed());
      }

      const igrac = action.igrac;
      const novaCena = trenutniKorisnik.virtuelniNovac - igrac.cena;
      const ime = trenutniKorisnik.ime;
      const id = trenutniKorisnik.id;

      if (novaCena < 0) {
        return of(IgracActions.buyIgracFailed());
      }

      const noviTrenutniKorisnik = {
        ...trenutniKorisnik,
        ime: ime,
        id: id,
        virtuelniNovac: novaCena,
      };

      return this.korisnikService
        .updateVirtuelniNovac(noviTrenutniKorisnik.id, noviTrenutniKorisnik.ime, noviTrenutniKorisnik.virtuelniNovac, noviTrenutniKorisnik.timId)
        .pipe(
          switchMap(() => [
            IgracActions.buyIgracSuccess({ igrac }),
            IgracActions.updateTrenutniKorisnik({ korisnik: noviTrenutniKorisnik }),
          ])
        );
    })
  )
);

removeIgracFromTransferLista$ = createEffect(() =>
  this.actions$.pipe(
    ofType(IgracActions.removeIgracIzTransferLista),
    mergeMap((action) =>
      this.fudbalskiTimService.ukloniIgracaSaTransferListe(action.igracId).pipe(
        map(() => IgracActions.obrisiIgracIzTransferListaSuccess({ igracId: action.igracId })),
        catchError(() => of(IgracActions.obrisiIgracIzTransferListaFailed()))
      )
    )
  )
);

updateIgraciTransferLista$ = createEffect(() =>
  this.actions$.pipe(
    ofType(IgracActions.obrisiIgracIzTransferListaSuccess),
    withLatestFrom(this.store.select(selectIgraciTransferLista)),
    map(([action, igraciTransferLista]) => {
      const igracIdZaBrisanje = action.igracId;
      return igraciTransferLista.filter(igrac => igrac.id !== igracIdZaBrisanje);
    }),
    map(igraci => IgracActions.updateIgraciTransferLista({ igraci }))
  )
);


swapPlayers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TimActions.swapPlayers),
    withLatestFrom(this.store.pipe(select(fromApp.selectTimState))),
    switchMap(([action, timState]) => {
      const { timID, igracIzlaziId, igracUlaziId } = action;
      const { igraciTeren, igraciZamena, trenutniTimID } = timState;

      if (igracIzlaziId !== null && igracUlaziId !== null) {

        const igracIzlazi = igraciTeren.find(igrac => igrac.id === igracIzlaziId);

        if (!igracIzlazi) {
          return of(TimActions.swapPlayersFailed({ error: 'Igrac za izlaz nije pronadjen' }));
        }

        return this.fudbalskiTimService.getIgracById(igracUlaziId).pipe(
          switchMap(igracUlazi => {

            const updatedIgraciTeren = igraciTeren.map(igrac => {
              if (igrac.id === igracIzlaziId) {
                return { ...igrac, id: igracUlaziId, ime: igracUlazi.ime, ocena: igracUlazi.ocena };
              }
              return igrac;
            });

            const updatedIgraciZamena = igraciZamena.map(igrac => {
              if (igrac.id === igracUlaziId) {
                return { ...igrac, id: igracIzlaziId, ime: igracIzlazi.ime, ocena: igracIzlazi.ocena };
              }
              return igrac;
            });

            return this.fudbalskiTimService.getTimById(timID).pipe(
              switchMap(timToUpdate => {
                if (!timToUpdate) {
                  return of(TimActions.swapPlayersFailed({ error: 'Tim not found' }));
                }

                return this.fudbalskiTimService.updateTimIgraci(
                  timID,
                  updatedIgraciTeren.map(igrac => igrac.id),
                  updatedIgraciZamena.map(igrac => igrac.id),
                  timToUpdate
                ).pipe(
                  map(() => TimActions.swapPlayersSuccess({ igraciTeren: updatedIgraciTeren, igraciZamena: updatedIgraciZamena })),
                  catchError(error => of(TimActions.swapPlayersFailed({ error: 'Prvi Error u return' })))
                );
              }),
            );
          })
        );
      } else {
        return of(TimActions.swapPlayersFailed({ error: 'Drugi error' }))
      }
    })
  )
);




  loadTimovi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadTimovi),
      mergeMap(() =>
        this.fudbalskiTimService.getSviTimovi()
          .pipe(
            map(timovi => TimActions.loadTimoviSuccess({ timovi })),
            catchError(() => of({ type: 'load error' }))
          )
      )
    )
  );

  updateTim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.updateTim),
      mergeMap(action =>
        this.fudbalskiTimService.updateTimIgraci(
          action.timId, action.igraciTeren, action.igraciZamena, action.tim
        )
          .pipe(
            map(() => TimActions.updateTimSuccess()),
            catchError(() => of({ type: 'load error' }))
          )
      )
    )
  );

  getTimById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadTimById),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          map(tim => {
            const igraciTeren = tim.igraciTeren;
            const igraciZamena = tim.igraciZamena;
            return TimActions.loadTimByIdSuccess({
              tim,
              igraciTeren, igraciZamena
            });
          }),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );


}

@Injectable()
export class IgracEffects {
  constructor(
    private actions$: Actions,
    private fudbalskiTimService: FudbalskitimService,
    private korisnikService: KorisnikService,
    private authService:AuthService,
    private jwtService:JwtService
  ) { }


  loadTrenutniKorisnik$ = createEffect(() =>
  this.actions$.pipe(
    ofType(IgracActions.loadTrenutniKorisnik),
    mergeMap(() => {
      if (this.authService.isLoggedIn()) {
        const token = this.jwtService.getToken();
        if (token) {
          const decodedToken = atob(token.split('.')[1]);
          const parsedToken = JSON.parse(decodedToken);
          const userId = parsedToken.id;

          return this.korisnikService.getKorisnikById(userId).pipe(
            map(korisnik => IgracActions.loadTrenutniKorisnikSuccess({ korisnik })),
            catchError(() => of({ type: 'Load Korisnik Failed' }))
          );
        }
      }
      return of({ type: 'Load Korisnik Failed' });
    })
  )
);




  loadIgraci$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IgracActions.loadIgraci),
      mergeMap(() =>
        this.fudbalskiTimService.getSviIgraci()
          .pipe(
            map(igraci => IgracActions.loadIgraciSuccess({ igraci })),
            catchError(() => of({ type: 'load error' }))
          )
      )
    )
  );

  getIgracById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IgracActions.loadIgracById),
      mergeMap(action =>
        this.fudbalskiTimService.getIgracById(action.igracID).pipe(
          map(igrac => IgracActions.loadIgracByIdSuccess({ igrac })),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );

  getIgraciByPozicija$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadIgraciByPozicija),
      mergeMap(action =>
        this.fudbalskiTimService.getIgraciByPozicija(action.pozicija, action.timID).pipe(
          map(igraci => IgracActions.loadIgraciByPozicijaSuccess({ igraci })),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );

  getIgraciZamena$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadIgraciZamena),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          map(tim => tim.igraciZamena),
          switchMap(igraciZamenaIds =>
            this.fudbalskiTimService.getIgraciByIds(igraciZamenaIds).pipe(
              map(igraciZamena => TimActions.loadIgraciZamenaSuccess({ igraciZamena })),
              catchError(() => of({ type: 'load error' }))
            )
          )
        )
      )
    )
  );

  getIgraciTeren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadIgraciTeren),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          map(tim => tim.igraciTeren),
          switchMap(igraciTerenIds =>
            this.fudbalskiTimService.getIgraciByIds(igraciTerenIds).pipe(
              map(igraciTeren => TimActions.loadIgraciTerenSuccess({ igraciTeren })),
              catchError(() => of({ type: 'load error' }))
            )
          )
        )
      )
    )
  );

  loadGolmani$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadGolmani),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          switchMap((tim: any) => {
            const golmaniIds: number[] = tim.igraciTeren;
            const igraciRequests: Observable<Igrac>[] = golmaniIds.map((id: number) =>
              this.fudbalskiTimService.getIgracById(id)
            );

            return forkJoin(igraciRequests).pipe(
              map((igraci: Igrac[]) => {
                const golmani: Igrac[] = igraci.filter(igrac => igrac.pozicija === 'golman');
                return TimActions.loadGolmaniSuccess({ golmani });
              }),
              catchError(error => of({ type: 'load error' }))
            );
          })
        )
      )
    )
  );

  loadOdbrambeni$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadOdbrambeni),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          switchMap((tim: any) => {
            const odbrambeniIds: number[] = tim.igraciTeren;
            const igraciRequests: Observable<Igrac>[] = odbrambeniIds.map((id: number) =>
              this.fudbalskiTimService.getIgracById(id)
            );

            return forkJoin(igraciRequests).pipe(
              map((igraci: Igrac[]) => {
                const odbrambeni: Igrac[] = igraci.filter(igrac => igrac.pozicija === 'odbrana');
                return TimActions.loadOdbrambeniSuccess({ odbrambeni });
              }),
              catchError(error => of({ type: 'load error' }))
            );
          })
        )
      )
    )
  );

  loadVeznjaci$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadVeznjaci),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          switchMap((tim: any) => {
            const veznjaciIds: number[] = tim.igraciTeren;
            const igraciRequests: Observable<Igrac>[] = veznjaciIds.map((id: number) =>
              this.fudbalskiTimService.getIgracById(id)
            );

            return forkJoin(igraciRequests).pipe(
              map((igraci: Igrac[]) => {
                const veznjaci: Igrac[] = igraci.filter(igrac => igrac.pozicija === 'sredina');
                return TimActions.loadVeznjaciSuccess({ veznjaci });
              }),
              catchError(error => of({ type: 'load error' }))
            );
          })
        )
      )
    )
  );

  loadNapadaci$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimActions.loadNapadaci),
      mergeMap(action =>
        this.fudbalskiTimService.getTimById(action.timID).pipe(
          switchMap((tim: any) => {
            const napadaciIds: number[] = tim.igraciTeren;
            const igraciRequests: Observable<Igrac>[] = napadaciIds.map((id: number) =>
              this.fudbalskiTimService.getIgracById(id)
            );

            return forkJoin(igraciRequests).pipe(
              map((igraci: Igrac[]) => {
                const napadaci: Igrac[] = igraci.filter(igrac => igrac.pozicija === 'napad');
                return TimActions.loadNapadaciSuccess({ napadaci });
              }),
              catchError(error => of({ type: 'load error' }))
            );
          })
        )
      )
    )
  );

}
