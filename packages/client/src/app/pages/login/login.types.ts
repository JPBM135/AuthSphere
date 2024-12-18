import type { FormControl, FormGroup } from '@angular/forms';

export type LoginPasswordStepForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

export type AuthenticatorCodeStepForm = FormGroup<{
  authenticatorCode: FormControl<string>;
}>;

export type EmailCodeStepForm = FormGroup<{
  emailCode: FormControl<string>;
}>;

export type PasskeyStepForm = FormGroup<{
  passkey: FormControl<string>;
}>;
