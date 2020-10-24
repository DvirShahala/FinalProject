import { Injectable } from '@angular/core';
import { userLogin } from '../../components/login/login.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';


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

  constructor(private http: HttpClient, private cookie: CookieService) { }

  // Check authenticate user
  checkAuthenticated(userDetails: userLogin) {
    return this.http.post(`${environment.BE_ENDPOINT}/users/login`, userDetails)
      .toPromise()
      .catch(err => console.log(err))
      .then();
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