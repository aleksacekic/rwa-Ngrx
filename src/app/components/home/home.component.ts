import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from 'src/app/emitters/emitters';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authenticated = false;
  message = '';

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/user', {withCredentials: true}).subscribe(
      (res: any) => {
        this.message = `${res.ime}`;
        Emitters.authEmitter.emit(true);
        this.authenticated = true;
      },
      err => {
        this.message = 'niste ulogovani';
        Emitters.authEmitter.emit(false);
        this.authenticated = false;
      }
    );
  }

}