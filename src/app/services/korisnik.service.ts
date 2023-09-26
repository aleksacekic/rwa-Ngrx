import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { environment } from 'src/environments/environment';
import { Igrac } from '../models/igrac';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  constructor(private httpClient: HttpClient) { }

  getKorisnikById(korisnikId: number) {
    return this.httpClient.get<Korisnik>(environment.api + `/korisnici/${korisnikId}`);
  }

  updateVirtuelniNovac(idKorisnika: number,ime:string, novoStanjeNovca: number, IDtima:number) {
    const noviKorisnik = {
      id:idKorisnika,
      ime:ime,
      virtuelniNovac: novoStanjeNovca,
      timId:IDtima
    };
    return this.httpClient.put<Korisnik>(environment.api + `/korisnici/${idKorisnika}`, noviKorisnik);
  }
  
  updateTrenutniKorisnik(korisnik: Korisnik) {
    return this.httpClient.put<Korisnik>(
      `${environment.api}/korisnici/${korisnik.id}`,
      korisnik
    );
  }
  
  

}
