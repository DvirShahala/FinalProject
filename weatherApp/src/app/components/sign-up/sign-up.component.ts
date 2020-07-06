import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  formGroup: FormGroup;
  hide: boolean = true;
  invalidErrorMsg = '';

  constructor(private formBuilder: FormBuilder,
              private routes: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('username');
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

  checkLengthPassword(control) {
    let enteredPassword = control.value
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

  getErrorFullName() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' : '';
  }
}
