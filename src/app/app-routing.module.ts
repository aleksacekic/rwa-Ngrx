import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferiComponent } from './components/transferi/transferi.component';
import { UtakmicaComponent } from './components/utakmica/utakmica.component';
import { FudbalskitimComponent } from './components/fudbalskitim/fudbalskitim.component';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: "fudbalskitim", component: FudbalskitimComponent
  },
  {path: "transferi", component: TransferiComponent
  },
  {path: "utakmica", component: UtakmicaComponent
  },
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
