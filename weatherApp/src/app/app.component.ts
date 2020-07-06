import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  isLogin: boolean = false;
  isSignUp: boolean = false;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('username') != null) {
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
