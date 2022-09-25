import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from 'src/app/core/services/microservices/identity/identity.service';
import { LoginRequest } from 'src/app/core/services/microservices/identity/interfaces/dto/identity-dto.interface';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-nopage',
  templateUrl: './nopage.component.html',
  styleUrls: ['./nopage.component.scss'],
})
export class NopageComponent implements OnInit {
  // TODO: Borrar tokenFormControl cuando vayamos a produccion
  tokenFormControl = new FormControl('');

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  toGoReports(): void {
    if (this.tokenFormControl.value) {
      this.authenticationService.setToken(this.tokenFormControl.value);
      this.router.navigate(['/app']);
    }
  }
}
