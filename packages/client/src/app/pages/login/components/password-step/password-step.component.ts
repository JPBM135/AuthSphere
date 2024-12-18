import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoginPasswordStepForm } from '../../login.types';

@Component({
  selector: 'app-password-step',
  imports: [ReactiveFormsModule],
  templateUrl: './password-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStepComponent {
  public loginForm = input.required<LoginPasswordStepForm>();

  public getControl(name: string): FormControl<string> {
    return this.loginForm().get(name) as FormControl<string>;
  }
}
