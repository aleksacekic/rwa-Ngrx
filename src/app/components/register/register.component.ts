import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router)
  {
    this.form = this.formBuilder.group({
    ime:'',
    email:'',
    password:''
   });
  }
  ngOnInit(): void {
  
  }

  submit(): void{
    if (this.form.invalid) {
      return;
    }
    this.http.post('http://localhost:3000/api/register', this.form.getRawValue()).subscribe(() => 
      this.router.navigate(['/login'])
    );
  }
}
