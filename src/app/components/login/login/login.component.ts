import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  neuspesnoLogovanje: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router,
    private jwtService: JwtService,
    )
  {
    this.form = this.formBuilder.group({
      email:'',
      password:''
     });
  }

  ngOnInit(): void {
    
  }

  submit(): void {
    this.http.post('http://localhost:3000/api/login', this.form.getRawValue(), { withCredentials: true })
      .subscribe(
        (response: any) => {
          if (response && response.message === 'success') {
            const token = this.jwtService.getToken();
            if (token) {
              const decodedToken = atob(token.split('.')[1]);
              const parsedToken = JSON.parse(decodedToken);
              const userId = parsedToken.id;
    
              this.router.navigate(['']);
            }
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.neuspesnoLogovanje = true;
          }
        }
      );
  }
  
}
