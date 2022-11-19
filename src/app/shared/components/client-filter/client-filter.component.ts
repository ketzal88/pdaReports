import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDetails } from '../../../core/services/microservices/identity/identity.interface';
import { StoreService } from 'src/app/core/services/store.service';
import { ClientService } from '../../../core/services/microservices/client/client.service';
import { take } from 'rxjs';
import {
  GetSubBasesResponse,
  SubBase,
} from '../../../core/services/microservices/client/client.interface';
import { StoreKeys } from '../../../core/consts/store-keys.enum';
import { AreaService } from 'src/app/core/services/microservices/individual/area.service';
import {
  AreaRequest,
  AreaResponse,
} from 'src/app/core/services/microservices/individual/area.interface';

@Component({
  selector: 'app-client-filter',
  templateUrl: './client-filter.component.html',
  styleUrls: ['./client-filter.component.scss'],
})
export class ClientFilterComponent implements OnInit {
  availableClients: any[];
  availableSubbases: SubBase[];
  availableAreas: AreaResponse[];

  //Variables
  userDetails: UserDetails;

  //Inputs
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;

  @Input() showAreaSelect: boolean = false;
  @Input() selectedAreaId: string = null;
  @Input() disable: boolean = false;

  //Outputs
  @Output() selectedClientEvent: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() selectedSubbaseEvent: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() selectedAreaEvent: EventEmitter<string> =
    new EventEmitter<string>();

  constructor(
    private storeService: StoreService,
    private clientService: ClientService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadClient();
    if (!this.selectedClientId) {
      this.selectedClientId = this.availableClients
        ? this.availableClients[0].key
        : undefined;
    }
    this.loadSubbase();

    this.saveBaseChange();
  }

  loadUserDetails(): void {
    this.userDetails = JSON.parse(
      this.storeService.getData(StoreKeys.USER_DETAILS)
    );
  }

  loadClient(): void {
    this.availableClients = this.userDetails.usersAccounts.map(account => ({
      key: account.base.baseId,
      name: account.base.link,
    }));

    this.availableClients = this.availableClients.filter(
      subbases => subbases.name.indexOf('.') === -1
    );
  }

  loadSubbase(): void {
    this.clientService
      .getSubbases({ baseId: this.selectedClientId })
      .pipe(take(1))
      .subscribe((res: GetSubBasesResponse) => {
        if (res.data) {
          this.availableSubbases = res.data;
          this.getAreas();
          let existsInSelectedClient = res.data.filter(
            x => x.id === this.selectedSubbaseId
          );
          if (existsInSelectedClient.length === 0) {
            this.selectedSubbaseId = res.data[0].id;
            this.saveSubBaseChage();
          } else {
            this.selectedSubbaseEvent.emit(this.selectedSubbaseId);
          }
        } else {
          this.selectedSubbaseId = null;
        }
      });
  }

  onSubbaseChange(event: any): void {
    if (!event) {
      return;
    }
    this.saveSubBaseChage();
    this.getAreas();
  }

  onBaseChange(event: any): void {
    if (!event) {
      return;
    }
    this.saveBaseChange();
    this.loadSubbase();
  }

  onAreaChange(event: any): void {
    if (event) {
      this.selectedAreaId = event;
    }
    this.selectedAreaEvent.emit(event);
  }

  saveSubBaseChage(): void {
    this.storeService.setData(
      StoreKeys.SELECTED_SUBBASE_ID,
      this.selectedSubbaseId
    );

    this.selectedSubbaseEvent.emit(this.selectedSubbaseId);
  }
  saveBaseChange(): void {
    this.storeService.setData(
      StoreKeys.SELECTED_BASE_ID,
      this.selectedClientId
    );
    this.selectedClientEvent.emit(this.selectedClientId);
  }

  //AREA
  getAreas(): void {
    this.areaService
      .getAreas(this.getAreaRequest())
      .pipe(take(1))
      .subscribe((data: AreaResponse[]) => {
        this.availableAreas = data;

        this.availableAreas.unshift({
          areaId: null,
          name: 'Todas',
          baseId: null,
          subBaseId: null,
          creationDate: null,
          deletionDate: null,
        });
        /*
        this.onAreaChange(
          this.availableAreas && this.availableAreas.length > 0
            ? this.availableAreas[0].areaId
            : null
        );
        */
      });
  }

  getAreaRequest(): AreaRequest {
    return {
      areaId: null,
      name: null,
      baseId: this.selectedClientId,
      subBaseId: this.selectedSubbaseId,
    };
  }
}
