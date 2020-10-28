import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import * as moment from "moment";

export interface userLogin {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  post: userLogin;
  hide: boolean = true;
  invalidErrorMsg = '';
  socialUser: SocialUser;
  @Output() isLogin = new EventEmitter();
  @Output() signUp = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    private loginService: AuthService,
    private routes: Router,
    public dialog: MatDialog,
    private authServiceSocial: SocialAuthService) { }

  ngOnInit() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.createForm();
    this.authServiceSocial.authState.subscribe((user) => {
      this.socialUser = user;
      if (user != null) {
        localStorage.setItem('id_token', this.socialUser.name);
        this.routes.navigate(['/weatherPage']);
        this.isLogin.emit(true);
      }
    });
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkLengthPassword]],
    });
  }

  checkLengthPassword(control: any) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.{6,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'Field is required' :
      this.formGroup.get('password').hasError('requirements') ? 'The field must contain at least 6 characters' : '';
  }

  async onSubmit(formValues) {
    this.post = formValues;
    const isAuth: any = await this.loginService.checkAuthenticated(this.post);
    // If email and password is correct
    if (isAuth) {
      this.setSession(isAuth);
      this.routes.navigate(['/weatherPage']);
      this.isLogin.emit(true);
    } else {
      this.invalidErrorMsg = 'Invalid username or password';
    }
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }


  signUpRequest() {
    this.signUp.emit(true);
  }

  signInWithGoogle(): void {
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}