import { createSelector } from '@ngrx/store';
import { TimState, IgracState, KorisnikState } from './igrac.reducer';
import * as fromApp from './igrac.reducer';
import { AppState } from '../app.state';
import {Igrac} from "src/app/models/igrac"



export const selectSveState = createSelector(
  (state: AppState) => state.timovi,
  (state: AppState) => state.igraci,
  (timovi, igraci) => ({
    timovi,
    igraci
  })
);
// --------------------------------------------------------------------

export const selectKorisnikState = createSelector(
  (state: AppState) => state.korisnici,
  (korisnici) => korisnici
);

export const selectTrenutniKorisnik = createSelector(
  selectKorisnikState,
  (state: KorisnikState) => state.trenutniKorisnik
);

export const selectIgraciTransferLista = createSelector(
  (state: AppState) => state.igraci.igraciTransferLista,
  (igraciTransferLista) => igraciTransferLista
);


export const selectKorisnikIdZaBrisanje = createSelector(
  selectKorisnikState,
  (state: KorisnikState) => state.uklonjeniKorisnikId
);
// ------------------------------------------------------------------------
export const selectTimState = createSelector(
  (state: AppState) => state.timovi,
  (timovi) => timovi
);

export const selectSviTimovi = createSelector(
  selectTimState,
  (state: TimState) => state.timovi
);

export const selectTrenutniTim = createSelector(
  selectTimState,
  (state: TimState) => state.timovi.find((tim) => tim.id === state.trenutniTimID)
);

export const selectAllIgraci = createSelector(
  (state: AppState) => state.igraci.igraci,
  (igraci) => igraci
);


export const selectIgraciTeren = createSelector(
  selectTimState,
  (state: TimState) => state.igraciTeren
);

export const selectIgraciZamena = createSelector(
  selectTimState,
  (state: TimState) => state.igraciZamena
);


export const selectGolmani = createSelector(
  selectTimState,
  selectIgraciTeren,
  (timState, igraci) => {
    const golmaniIds = timState.igraciTeren
      .filter(igrac => igrac.pozicija === 'golman')
      .map(igrac => igrac.id);

    const golmani = igraci.filter(igrac => golmaniIds.includes(igrac.id));
     
    return golmani;
  }
);
export const selectOdbrambeni = createSelector(
  selectTimState,
  selectIgraciTeren,
  (timState, igraci) => {
 
    const odbrambeniIds = timState.igraciTeren
      .filter(igrac => igrac.pozicija === 'odbrana')
      .map(igrac => igrac.id);

    const odbrambeni = igraci.filter(igrac => odbrambeniIds.includes(igrac.id));

    return odbrambeni;
  }
);

export const selectVeznjaci = createSelector(
  selectTimState,
  selectIgraciTeren,
  (timState, igraci) => {
 
    const vezniIds = timState.igraciTeren
      .filter(igrac => igrac.pozicija === 'sredina')
      .map(igrac => igrac.id);

    const veznjaci = igraci.filter(igrac => vezniIds.includes(igrac.id));

    return veznjaci;
  }
);

export const selectNapadaci = createSelector(
  selectTimState,
  selectIgraciTeren,
  (timState, igraci) => {
 
    const napadaciIds = timState.igraciTeren
      .filter(igrac => igrac.pozicija === 'napad')
      .map(igrac => igrac.id);

    const napadaci = igraci.filter(igrac => napadaciIds.includes(igrac.id));

    return napadaci;
  }
);


