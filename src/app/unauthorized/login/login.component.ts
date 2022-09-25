import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { IdentityService } from 'src/app/core/services/microservices/identity/identity.service';
import { LoginRequest } from 'src/app/core/services/microservices/identity/interfaces/dto/identity-dto.interface';
import { SnackBarMessage } from 'src/app/shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from '../../core/services/displayMessage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginSub: Subscription;

  @ViewChild('userNameInput') userNameInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  hide: boolean;

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private displayMessageService: DisplayMessageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  loginAutomatico(): void {
    const loginRequest: LoginRequest = {
      username: 'mSincovich',
      password: 'Delta123',
    };

    this.loginSub = this.identityService.loginUser(loginRequest).subscribe({
      next: (response: Boolean) => {
        if (response) {
          this.router.navigate(['/app']);
        } else {
          alert('Error al ingresar, revise sus credenciales');
        }
      },
      error: err => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  login(): void {
    const loginRequest: LoginRequest = {
      username: this.userNameInput.nativeElement.value,
      password: this.passwordInput.nativeElement.value,
    };

    this.loginSub = this.identityService.loginUser(loginRequest).subscribe({
      next: (response: Boolean) => {
        if (response) {
          this.router.navigate(['/app']);
        } else {
          let success = new SnackBarMessage('Las credenciales no son validas.');
          success.duration = 4;
          this.displayMessageService.openSnackBar(success);
        }
      },
      error: err => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}
