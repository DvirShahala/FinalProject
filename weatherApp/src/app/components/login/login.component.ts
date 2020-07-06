import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';


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
  @Output() isLogin = new EventEmitter();
  @Output() signUp = new EventEmitter();


  constructor(private formBuilder: FormBuilder,
    private loginService: AuthService,
    private routes: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    localStorage.removeItem('username');
    this.createForm();
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

  onSubmit(formValues) {
    this.post = formValues;
    var output = this.loginService.checkAuthenticated(this.post);
    if (output == true) {
      this.routes.navigate(['/wheatherPage']);
      this.isLogin.emit(true);
    } else {
      this.invalidErrorMsg = 'Invalid username or password';
    }
  }

  signUpRequest() {
    this.signUp.emit(true);
  }


  openDialog() {
    this.dialog.open(PopUpComponent);
  }
}