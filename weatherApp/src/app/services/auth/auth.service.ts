import { Injectable } from '@angular/core';
import { userLogin } from '../../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  checkAuthenticated(userDetails: userLogin) {
    if (userDetails.email == "dvir@gmail.com" && userDetails.password == "Dvir123") {
      localStorage.setItem('username', "dvir");
      return true;
    }
    else {
      return false;
    }
  }
}