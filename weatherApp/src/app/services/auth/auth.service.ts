import { Injectable } from '@angular/core';
import { userLogin } from '../../components/login/login.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


interface User {
  email: string;
  fullName: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public users: any;

  constructor(private http: HttpClient) { }

  // Check authenticate user
  checkAuthenticated(userDetails: userLogin): Promise<boolean> {
    let parameters = new HttpParams().set('email', userDetails.email);

    return this.http.get<User>(`${environment.BE_ENDPOINT}/users/specific`, { params: parameters }).toPromise().catch(err => console.log(err)).then((user: User) => {
      if (user[0] != undefined) {
        if (userDetails.password == user[0].password) {
          localStorage.setItem('username', user[0].fullName);
          return true;
        }
      }
      return false;
    });
  }

  // Check if email in use
  checkInUseEmail(email): Promise<boolean> {
    let parameters = new HttpParams().set('email', email);

    return this.http.get<User>(`${environment.BE_ENDPOINT}/users/specific`, { params: parameters }).toPromise().catch(err => console.log(err)).then((user: User) => {
      if (user[0] != undefined) {
        return true;
      } else {
        return false;
      }
    });
  }

  createAccount(user: User) {
    this.http.post(`${environment.BE_ENDPOINT}/users/`,
      {
        fullName: user.fullName,
        email: user.email,
        password: user.password
      }).toPromise();
  }
}