import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import type {
  AuthenticatorCodeStepForm,
  EmailCodeStepForm,
  LoginPasswordStepForm,
  PasskeyStepForm,
} from '../login.types';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStep: 'authenticatorCode' | 'emailCode' | 'passkey' | 'password' = 'password';

  public loginForm: LoginPasswordStepForm = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
    ]) as FormControl<string>,
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]) as FormControl<string>,
  });

  public authenticatorCodeForm: AuthenticatorCodeStepForm = new FormGroup({
    authenticatorCode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\d*$/),
    ]) as FormControl<string>,
  });

  public emailCodeForm: EmailCodeStepForm = new FormGroup({
    emailCode: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern(/^[\dA-Fa-f]*$/),
    ]) as FormControl<string>,
  });

  public passkeyForm: PasskeyStepForm = new FormGroup({
    passkey: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]) as FormControl<string>,
  });
}
