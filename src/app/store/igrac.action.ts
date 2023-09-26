import { createAction, props } from '@ngrx/store';
import { Tim } from '../models/tim';
import { Igrac } from '../models/igrac';
import { Korisnik } from '../models/korisnik';

export const resetState = createAction('[Auth] Reset State');

export const startMatchSimulation = createAction(
  'Start Match Simulation',
  props<{ protivnikId: number }>()
);
export const startMatchSimulationSuccess = createAction(
  'Start Match Simulation Success',
  props<{ pobednik: Tim }>()
);
export const startMatchSimulationFailure = createAction(
  'Start Match Simulation Failure'
);

export const updateMatchResult = createAction(
  'Update Match Result',
  props<{ winner: Tim }>()
);

export const loadTimovi = createAction('Load Timovi');
export const loadTimoviSuccess = createAction(
  'Load Timovi Success',
  props<{ timovi: Tim[] }>()
);
export const loadTimoviFailure = createAction(
  'Load timovi Failure'
)

export const loadTimById = createAction(
  'Load Tim preko ID',
  props<{ timID: number }>()
);
export const loadTimByIdSuccess = createAction(
  'Load Tim preko ID Success',
  props<{ tim: Tim,
          igraciTeren: [],
          igraciZamena:[], 
        }>()
);
export const loadTimByIdFailure = createAction(
  'Load timovi by ID Failure'
)
// ------------------------------------------------------------

export const addIgracToZamene = createAction(
  'Dodaj Igraca u Zamene',
  props<{ timId: number, igracId: number }>()
);

export const addIgracToZameneSuccess = createAction(
  'Dodaj Igraca u Zamene Success',
  props<{ timId: number, igracId: number }>()
);

export const addIgracToZameneFailed = createAction(
  'Dodaj Igraca u Zamene Failed'
);

export const addKupljeniIgracURoster = createAction(
  'Dodaj Kupljenog igraca u niz igraca',
  props<{ kupljeniIgrac: Igrac, ciljaniTimId: number }>()
);

export const addKupljeniIgracSuccess = createAction(
  'Kupovina I Dodavanje Igraca Success',
  props<{ kupljeniIgrac: Igrac, azuriraniIdTima: number }>()
);

export const addKupljeniIgracFailed= createAction(
  'Kupovina i DOdavanje Igraca Failed'
);

export const loadTrenutniKorisnik = createAction(
  'Load Trenutni Korisnik',
  props<{ korisnikId: number }>()
);

export const loadTrenutniKorisnikSuccess = createAction(
  'Load Trenutni Korisnik Success',
  props<{ korisnik: Korisnik }>()
);


export const updateTrenutniKorisnik = createAction(
  'Update Trenutni Korisnik',
  props<{ korisnik: Korisnik }>()
);

export const updateIgraciTransferLista = createAction(
  'Update Igraci Transfer Lista',
  props<{ igraci: Igrac[] }>()
);



export const buyIgrac = createAction(
  'Pokreni kupovanje',
  props<{ igrac: Igrac }>()
);

export const buyIgracSuccess = createAction(
  'buyIgrac Success',
  props<{ igrac: Igrac }>()
);


export const buyIgracFailed = createAction(
  'buyIgrac Failed'
);

export const removeIgracIzTransferLista = createAction(
  'Remove Korisnik Iz Transfer Lista',
  props<{ igracId: number }>()
);



export const obrisiIgracIzTransferListaSuccess = createAction(
  'Obrisi Korisnik Iz Transfer Lista Success',
  props<{ igracId: number }>()
);

export const obrisiIgracIzTransferListaFailed = createAction('Obrisi Igrac Iz Transfer Lista Failed');

// -----------------------------------------------------------------

export const swapPlayers = createAction(
  "Swap players",
  props<{timID:number, igracUlaziId: number, igracIzlaziId: number }>()
);

export const swapPlayersSuccess = createAction(
  "Swap players Success",
  props<{ igraciTeren: Igrac[], igraciZamena: Igrac[] }>()
);


export const updateTim = createAction(
  'Update Tim',
  props<{ timId:number,
          igraciTeren: [],
          igraciZamena: [],
          tim: Tim
           }>()
);
export const updateTimSuccess = createAction('Update Tim Success');

    export const loadIgraci = createAction('Load Igraci');
export const loadIgraciSuccess = createAction(
  'Load Igraci Success',
  props<{ igraci: Igrac[] }>()
);

export const loadIgracById = createAction('Load Igrac preko ID', props<{ igracID:number }>());
export const loadIgracByIdSuccess = createAction(
  'Load Igrac preko ID Success',
  props<{ igrac: Igrac }>()
);

export const loadIgraciByPozicija = createAction('Load Igrac preko Pozicije', props<{ pozicija:string, timID:number }>());
export const loadIgraciByPozicijaSuccess = createAction(
  'Load Igrac preko Pozicije Success',
  props<{ igraci: Igrac[] }>()
);

export const loadIgraciTeren = createAction(
  'Load Igraci Teren',
  props<{ timID: number }>()
);
export const loadIgraciTerenSuccess = createAction(
  'Load Igraci Teren Success',
  props<{ igraciTeren: Igrac[] }>()
);

export const loadIgraciZamena = createAction(
  'Load Igraci Zamena',
  props<{ timID: number }>()
);

export const loadIgraciZamenaSuccess = createAction(
  'Load Igraci Zamena Success',
  props<{ igraciZamena: Igrac[] }>()
);

export const updateIgrac = createAction(
  'Update Igrac',
  props<{ igrac: Igrac }>()
);

export const updateIgracSuccess = createAction(
  'Update Igrac Success'
);

export const loadGolmani = createAction(
  'Load Golmani',
  props<{ timID: number }>()
);

export const loadGolmaniSuccess = createAction(
  'Load Golmani Success',
  props<{ golmani: Igrac[] }>()
);

export const loadOdbrambeni = createAction(
  'Load Odbrambeni',
  props<{ timID: number }>()
);

export const loadOdbrambeniSuccess = createAction(
  'Load Odbrambeni Success',
  props<{ odbrambeni: Igrac[] }>()
);

export const loadVeznjaci = createAction(
  'Load Veznjaci',
  props<{ timID: number }>()
);

export const loadVeznjaciSuccess = createAction(
  'Load Veznjaci Success',
  props<{ veznjaci: Igrac[] }>()
);

export const loadNapadaci = createAction(
  'Load napadaci',
  props<{ timID: number }>()
);

export const loadNapadaciSuccess = createAction(
  'Load napadaci Success',
  props<{ napadaci: Igrac[] }>()
);

export function swapPlayersFailed(arg0: { error: string; }): any {
  throw new Error('Function not implemented.');
}



