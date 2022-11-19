import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdentityService } from 'src/app/core/services/microservices/identity/identity.service';
import { CustomValidators } from 'src/app/core/utils/custom-validators';
import {
  DislayType,
  SnackBarMessage,
} from 'src/app/shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from '../../../core/services/displayMessage.service';
import { RecoveryPasswordRequest } from '../../../core/services/microservices/identity/interfaces/dto/identity-dto.interface';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit, OnDestroy {
  loginSub: Subscription;

  @ViewChild('userNameInput') userNameInput: ElementRef;
  @ViewChild('tokenInput') tokenInput: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput: ElementRef;

  hide: boolean;
  requestedRecovery: boolean = false;

  recoveryPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private displayMessageService: DisplayMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.recoveryPasswordForm = this.formBuilder.group({
      tokenInput: ['', [Validators.required]],
      newPasswordInput: [
        null,
        Validators.compose([
          // 1. Password Field is Required
          Validators.required,
          // 2. check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          // 3. check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          // 4. check whether the entered password has a lower-case letter
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          // 5. Has a minimum length of 8 characters
          Validators.minLength(8),
        ]),
      ],
    });
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  sendForgotPassword(): void {
    const username = this.userNameInput.nativeElement.value;

    this.loginSub = this.identityService.forgotPassword(username).subscribe({
      next: () => {
        this.requestedRecovery = true;
      },
      error: err => {
        console.warn('BE- Error:', err);
      },
      complete: () => {},
    });
  }

  sendRecoveryPassword(): void {
    const loginRequest: RecoveryPasswordRequest = {
      token: this.tokenInput.nativeElement.value,
      password: this.newPasswordInput.nativeElement.value,
    };

    this.loginSub = this.identityService
      .recoveryPassword(loginRequest)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigate(['/app']);
        },
        error: err => {
          const errorMessage: SnackBarMessage = {
            duration: 5,
            title: 'Error Recovering passowrd',
            type: DislayType.SNACKBAR,
          };
          this.displayMessageService.openSnackBar(errorMessage);
          console.warn('BE- Error:', err);
        },
        complete: () => {},
      });
  }
}
