import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WeatherPageComponent } from './components/weather-page/weather-page.component';
import { AuthGuardGuard } from './guards/auth/auth-guard.guard'

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'signUp', component: SignUpComponent },
  { path: 'weatherPage', component: WeatherPageComponent, canActivate: [AuthGuardGuard] }
  //{ path: '**', redirectTo: 'weatherPage'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
