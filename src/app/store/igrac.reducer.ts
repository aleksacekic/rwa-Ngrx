import { createReducer, on, select } from "@ngrx/store";
import { Igrac } from "../models/igrac";
import { Tim } from "../models/tim";
import { addIgracToZameneSuccess, addKupljeniIgracSuccess, buyIgracSuccess, loadGolmaniSuccess, loadIgraciSuccess, loadIgraciTerenSuccess, loadIgraciZamenaSuccess, loadNapadaciSuccess, loadOdbrambeniSuccess, loadTimByIdSuccess, loadTimoviSuccess, loadTrenutniKorisnikSuccess, loadVeznjaciSuccess, obrisiIgracIzTransferListaSuccess, removeIgracIzTransferLista, resetState, startMatchSimulation, startMatchSimulationFailure, startMatchSimulationSuccess, swapPlayers, swapPlayersSuccess, updateIgracSuccess, updateIgraciTransferLista, updateMatchResult, updateTimSuccess } from "./igrac.action";
import { Korisnik } from "../models/korisnik";
import { AppState } from "../app.state";

export const selectTimState = (state: TimState) => state.timovi;


export interface IgracState {
  igraci: Igrac[],
  pozicija:string,
  igraciTransferLista: Igrac[];
}

export interface TimState {
  timovi: Tim[];
  trenutniTimID: number;
  igraciTeren: Igrac[];
  igraciZamena: Igrac[];
  selectedPlayerIdOut: number | null;
  selectedPlayerIdIn: number | null;
}


const initialStateTim: TimState = {
  timovi: [],
  trenutniTimID:0,
  igraciTeren: [],
  igraciZamena:[],
  selectedPlayerIdOut: 0,
  selectedPlayerIdIn: 0
};

const initialStateIgraci: IgracState = {
  igraci: [],
  pozicija:"",
  igraciTransferLista: []
};

export interface KorisnikState {
  korisnici:Korisnik[],
  trenutniKorisnik: Korisnik,
  uklonjeniKorisnikId: number | null,
  timId:number;
}

export const initialStateKorisnik: KorisnikState = {
  korisnici:[],
  trenutniKorisnik: {id:0,ime:"",virtuelniNovac:0, timId:0, email:"", password:""},
  uklonjeniKorisnikId: null,
  timId:0
};

export interface MatchState {
  currentTeam: Tim | null;
  allTeams: Tim[];
  winner: Tim | null;
}
export const initialStateMec: MatchState = {
  currentTeam: null,
  allTeams: [],
  winner: null,
 }

 export const matchReducer = createReducer(
    initialStateMec,
  on(startMatchSimulation, state => ({
    ...state
  })),
  on(startMatchSimulationSuccess, (state, { pobednik }) => ({
    ...state,
    winner: pobednik
  })),
  on(updateMatchResult, (state, { winner }) => ({
    ...state,
    winner,
  })),
 )

export const korisnikReducer = createReducer(
  initialStateKorisnik,
  on(resetState, () => initialStateKorisnik),
  on(buyIgracSuccess, (state, { igrac }) => {
    const trenutniKorisnik = state.trenutniKorisnik;
    if (trenutniKorisnik) {
      const novaCena = trenutniKorisnik.virtuelniNovac - igrac.cena;
      console.log(novaCena);
      if (novaCena >= 0) {
        const noviTrenutniKorisnik: Korisnik = {
          ...trenutniKorisnik,
          virtuelniNovac: novaCena,
        };
        
        return {
          ...state,
          trenutniKorisnik: noviTrenutniKorisnik,
        };
      }
    }
    console.log(state);
    return state;
  }),
  on(loadTrenutniKorisnikSuccess, (state, { korisnik }) => {
    console.log(state);
    console.log(korisnik)
    return {
      ...state,
      trenutniKorisnik: korisnik,
    };
  }),
  
);

export const timReducer = createReducer(
  initialStateTim,
  on(resetState, () => initialStateTim),
  on(addIgracToZameneSuccess, (state, { timId, igracId }) => {
    const updatedTimovi = state.timovi.map(tim => {
      if (tim.id === timId) {
        return {
          ...tim,
          igraciZamena: [...tim.igraciZamena, igracId]
        };
      }
      return tim;
    });

    return {
      ...state,
      timovi: updatedTimovi
    };
  }),
  on(buyIgracSuccess, (state, { igrac }) => {
    const noviTimovi = state.timovi.map(tim => {
      if (tim.id === state.timovi[0].id) {
        return {
          ...tim,
          igraciZamena: [...tim.igraciZamena, igrac.id]
        };
      }
      return tim;
    });

    return {
      ...state,
      timovi: noviTimovi,
    };
  }),
  on(swapPlayersSuccess, (state, { igraciTeren, igraciZamena }) => ({
    ...state,
    igraciTeren,
    igraciZamena,
  })),
  on(loadTimoviSuccess, // znaci treba da def kako ce se stanje promeniti posle akcije loadTimoviSucces
     (state, { timovi }) =>
      ({ ...state, //destruktuiramo
         timovi: timovi })), //moze i samo timovi
  on(updateTimSuccess, state => ({ ...state })),
  on(swapPlayers, (state, { igracIzlaziId, igracUlaziId }) => ({
    ...state,
    selectedPlayerIdOut: igracIzlaziId,
    selectedPlayerIdIn: igracUlaziId
  })),


  on(loadTimByIdSuccess, (state, { tim,
     igraciTeren, igraciZamena }) => {
    return {
      ...state,
      timovi: state.timovi.map(postojeciTim =>
        postojeciTim.id === tim.id ? { ...tim } : postojeciTim
      ),
      igraciTerenIds: igraciTeren,
      igraciZamenaIds: igraciZamena
    };
  }),
  on(loadIgraciZamenaSuccess, (state, { igraciZamena }) => {
    return {
      ...state,
      igraciZamena: igraciZamena
    };
  }),
  on(loadIgraciTerenSuccess, (state, { igraciTeren }) => {
    return {
      ...state,
      igraciTeren: igraciTeren
    };
  }),
  on(loadGolmaniSuccess, (state, { golmani }) => {
    return {
      ...state,
      golmani: golmani
    };
  }),
  on(loadOdbrambeniSuccess, (state, { odbrambeni }) => {
    return {
      ...state,
      odbrambeni: odbrambeni
    };
  }),
  on(loadVeznjaciSuccess, (state, { veznjaci }) => {
    return {
      ...state,
      veznjaci: veznjaci
    };
  }),
  on(loadNapadaciSuccess, (state, { napadaci }) => {
    return {
      ...state,
      napadaci: napadaci
    };
  })
);



export const igracReducer = createReducer(
  initialStateIgraci,
  on(resetState, () => initialStateIgraci),
  on(loadIgraciSuccess,
     (state, { igraci }) =>
      ({ ...state,
         igraci: igraci })),
  // on(buyIgracSuccess, (state, { igrac }) => {
  //   const noviIgraci = [...state.igraci, { ...igrac, timId: 1 }];
    
  //   const noviIgraciTransferLista = state.igraciTransferLista.filter(i => i.id !== igrac.id);
  
  //   return {
  //     ...state,
  //     igraci: noviIgraci,
  //     igraciTransferLista: noviIgraciTransferLista
  //   };
  // }),
  on(removeIgracIzTransferLista, (state, { igracId }) => {
    const updatedTransferLista = state.igraciTransferLista.filter(igrac => igrac.id !== igracId);
    
    return {
      ...state,
      igraciTransferLista: updatedTransferLista,
    };
  }),
  on(obrisiIgracIzTransferListaSuccess, (state, { igracId }) => {
    return {
      ...state,
      uklonjeniKorisnikId: igracId,
    };
  }),
  on(updateIgraciTransferLista, (state, { igraci }) => ({
    ...state,
    igraciTransferLista: igraci,
  }
  )),
  on(addKupljeniIgracSuccess, (state, action) => {
    const noviIgraci = [...state.igraci, { ...action.kupljeniIgrac, timId: action.azuriraniIdTima }];

    return {
      ...state,
      igraci: noviIgraci,
    };
  }),  
  
);

