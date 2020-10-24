import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  isLogin: boolean = false;
  isSignUp: boolean = false;

  constructor(private cookie: CookieService) { }

  ngOnInit() {
    if (localStorage.getItem('id_token') != null) {
      this.isLogin = true;
    }
  }

  handleLogin(checkLogin: boolean) {
    this.isLogin = checkLogin;
  }

  handleSignUp(signUp: boolean) {
    this.isSignUp = signUp;
  }
}