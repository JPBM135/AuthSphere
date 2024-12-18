import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PasswordStepComponent } from './components/password-step/password-step.component';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  imports: [PasswordStepComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public constructor(public readonly loginService: LoginService) {}
}
