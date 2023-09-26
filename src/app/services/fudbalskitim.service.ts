import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Igrac } from '../models/igrac';
import { Tim } from '../models/tim';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FudbalskitimService {

  constructor(private httpClient: HttpClient) { }


  getLastAddedIgracId() {
    return this.httpClient.get<number>(environment.api + `/igraci/lastAddedId`);
  }

  dodajIgracaZamenama(igracZamenaID: number, timId: number) {
    return this.httpClient.get<Tim>(environment.api + `/timovi/${timId}`).pipe(
      switchMap((tim: Tim) => {
        tim.igraciZamena.push(igracZamenaID);

        return this.httpClient.put<Tim>(environment.api + `/timovi/${timId}/dodajIgracaZamenama/${igracZamenaID}`, tim);
      })
    );
  }


  getTimById(timId: number) {
    return this.httpClient.get<any>(environment.api + `/timovi/${timId}`);
  }

  getSviTimovi(){
    return this.httpClient.get<Tim[]>(environment.api + "/timovi");
  }


  updateTimIgraci(timId: number, igraciTerenIds: number[], igraciZamenaIds: number[], tim:Tim): Observable<any> {
    const url = `${environment.api}/timovi/${timId}/updateigraci`;
    const updatedData = {
      ...tim,
      teren: igraciTerenIds,
      zamena: igraciZamenaIds
    };
  
    return this.httpClient.put(url, updatedData);
  }

  // IGRACI

  getSviIgraci(){
    return this.httpClient.get<Igrac[]>(environment.api + "/igraci");
  }

  getIgracById(igracId: number) {
    return this.httpClient.get<Igrac>(environment.api + `/igraci/${igracId}`);
  }

  dodajIgracaUListuIgraca(igrac: Igrac, ciljaniTimId: number) {
    const updatedIgrac = { ...igrac, timId: ciljaniTimId };
    return this.httpClient.post(`${environment.api}/igraci`, updatedIgrac);
  }

  dodajIgraca(igrac: Igrac) {
    return this.httpClient.post<Igrac>(`${environment.api}/igraci/`, igrac);
  }

  getIgraciByIds(igraciIds: number[]): Observable<Igrac[]> {
    const requests: Observable<Igrac>[] = igraciIds.map(id => this.getIgracById(id));
    return forkJoin(requests);
  }

  getIgraciByPozicija(pozicija: string, timId: number) {
    return this.httpClient.get<Igrac[]>(environment.api + `/igraci?pozicija=${pozicija}&timId=${timId}`);
  }

  // IGRACI TRANSFER LISTA

  getIgraciTransferLista() {
    return this.httpClient.get<Igrac[]>
    (environment.api + "/igraciTransferLista");
  }

  ukloniIgracaSaTransferListe(igracId: number) {
    return this.httpClient.delete<void>(`${environment.api}/igraciTransferLista/${igracId}`);
  }

  updateIgraciTransferLista(igraci: Igrac[]): Observable<void> {
    return this.httpClient.put<void>(`${environment.api}/igracitransferlista`, igraci);
  }

 
}

