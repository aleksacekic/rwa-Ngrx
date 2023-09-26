import { Igrac } from './models/igrac';
import { Korisnik } from './models/korisnik';
import { IgracState, KorisnikState, TimState } from './store/igrac.reducer';


export interface AppState {
  timovi: TimState,
  igraci: IgracState,
  korisnici: KorisnikState
}
