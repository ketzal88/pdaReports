import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  poweredImg: string = `${environment.pathPowered}/poweredbypda.png`;
  constructor(private storeService: StoreService) {
    this.userName = this.storeService.getData(StoreKeys.USER_USERNAME);
  }

  userName: string;

  ngOnInit(): void {}

  redirectToPDAPlatform(): void {
    window.location.href = environment.pdaPlatformURL;
  }
}
