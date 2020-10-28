import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  formGroup: FormGroup;
  hide: boolean = true;
  invalidErrorMsg = '';
  post: any;
  if_used: any;

  constructor(private formBuilder: FormBuilder, private routes: Router, private authService: AuthService) { }

  ngOnInit(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.createForm();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'fullName': [null, [Validators.required]],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkLengthPassword]]
    });
  }

  async onSubmit(post) {
    await this.authService.createAccount(post);
    //window.location.href = window.location.hostname;
    window.location.reload();
  }

  checkLengthPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.{6,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' :
        this.formGroup.get('email').hasError('alreadyInUse') ? 'This email address is already in use' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'Field is required' :
      this.formGroup.get('password').hasError('requirements') ? 'The field must contain at least 6 characters' : '';
  }

  getErrorFullName() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' : '';
  }
}