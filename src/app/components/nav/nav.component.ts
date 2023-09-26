import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Emitters } from 'src/app/emitters/emitters';
import { resetState } from 'src/app/store/igrac.action';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authenticated = false;

  constructor(private http:HttpClient, private store: Store) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    );
  }

  logout() : void {
    this.http.post('http://localhost:3000/api/logout', {}, {withCredentials:true}).subscribe(()=>{
      this.authenticated = false;
    })
    this.store.dispatch(resetState());
  }
}


