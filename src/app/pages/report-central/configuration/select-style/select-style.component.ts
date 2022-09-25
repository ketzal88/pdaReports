import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ReportStyles } from '../interfaces/reportStyles.interface';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StepModel } from '../../../../core/models/step.model';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../core/services/language.service';
import { StateLanguage } from '../../../../core/consts/state-language.enum';
import { unsubscribe } from 'src/app/core/utils/subscription.util';
import { ImageSizingParameters } from '../../../../shared/components/uploaders/image-uploader/image-uploader.interface';
import { StoreService } from '../../../../core/services/store.service';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';
import { TypeFilterItem } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { Consistency } from '../../../../core/services/microservices/individual/individual.interface';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { Loader } from '../../../../core/services/loader/loader';
import { GenderService } from '../../../../core/services/microservices/individual/gender.service';
import { GenderResponse } from '../../../../core/services/microservices/individual/gender.interface';
import { ClientService } from '../../../../core/services/microservices/client/client.service';
import { environment } from '../../../../../environments/environment';
import { ClientResponse } from '../../../../core/services/microservices/client/client.interface';

@Component({
  selector: 'app-select-style',
  templateUrl: './select-style.component.html',
  styleUrls: ['./select-style.component.scss'],
})
export class SelectStyleComponent implements OnInit, OnDestroy {
  //bindings
  savedStyle!: string;
  validImageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/svg',
    'image/svg+xml',
  ];
  imageSizingParameters: ImageSizingParameters = {
    minHeight: 10,
    minWidth: 10,
    checkSameImageProportion: false,
    maxHeight: 80,
    maxWidth: 260,
  };
  logoFileName: string;
  selectedItemUrl: string;
  selectedClientId: string;
  selectedSubbaseId: string;
  typeFilterList: TypeFilter[];

  //Variables
  pathFileManager = environment.apiFileManager;

  //Inputs
  @Input() step!: StepModel;

  //Outputs
  @Output() selectedItem = new EventEmitter<ReportStyles>();
  @Output() selectedClientEvent: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() selectedSubbaseEvent: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() typeFiltersEvent: EventEmitter<TypeFilter[]> = new EventEmitter<
    TypeFilter[]
  >();
  //Loaders
  gendersLoader: Loader;
  logoLoader: Loader;

  //Subscriptions
  languageServiceSub!: Subscription;
  gendersSub: Subscription;
  clientSub: Subscription;

  availableStyles: ReportStyles[] = [
    {
      key: 'pda',
      name: 'Estilo PDA',
      imageUrl: '/assets/styleImages/Type1.jpg',
      selected: false,
    },
    {
      key: 'pda-night',
      name: 'Estilo Night',
      imageUrl: '/assets/styleImages/Type2.jpg',
      selected: false,
    },
    {
      key: 'pda-sea',
      name: 'Estilo Sea',
      imageUrl: '/assets/styleImages/Type3.jpg',
      selected: false,
    },
  ];

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private displayMessageService: DisplayMessageService,
    private languageService: LanguageService,
    private storeService: StoreService,
    private genderService: GenderService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.typeFilterList = [];
    this.gendersLoader = new Loader();
    this.logoLoader = new Loader();

    let userId = this.storeService.getData(StoreKeys.USER_ID);
    this.logoFileName = userId;
    this.loadClientAndSubbase();
    this.initSelectStyle();
    //Se subscribe para escuchar el evento y tomar alguna accion
    this.languageServiceSub = this.languageService
      .getCurrentStateLanguage()
      .subscribe(stateLanguage => {
        if (stateLanguage === StateLanguage.CHANGING) {
          this.languageService.setChangeStateLanguage(StateLanguage.CHANGED);
        }
      });
    this.loadStateConsistencyFilter();
  }

  ngOnDestroy(): void {
    unsubscribe(this.languageServiceSub);
    unsubscribe(this.clientSub);
  }

  getLogoClient(): void {
    this.clientSub = this.logoLoader
      .load(this.clientService.getClient(this.selectedClientId))
      .subscribe({
        next: (data: ClientResponse) => {
          if (data && data?.logoReportPath) {
            //Guardar logo que viene del servicio
            this.selectedItemUrl = data.logoReportPath;
          }
        },
        error: err => {
          console.log('error: ', err);
        },
      });
  }

  loadLogoTemp(): void {
    this.selectedItemUrl =
      environment.apiFileManager + '/Temporal/' + this.logoFileName + '.jpg';
  }

  loadClientAndSubbase(): void {
    this.selectedClientId = this.storeService.getData(
      StoreKeys.SELECTED_BASE_ID
    );
    this.selectedSubbaseId = this.storeService.getData(
      StoreKeys.SELECTED_SUBBASE_ID
    );
  }

  initSelectStyle(): void {
    if (!this.localStorageService.getValue('style')) {
      this.savedStyle = 'pda';
    } else {
      this.savedStyle = localStorage.getItem('style');
    }

    const foundItem = this.availableStyles.find(
      style => style.key === this.savedStyle
    );
    if (foundItem) {
      this.setSelectedItem(foundItem);
    }
  }

  showPopUp(selected: ReportStyles): void {
    const foundItem = this.availableStyles.find(
      style => style.name === selected.name
    );
    if (foundItem) {
      let parameters = new PopUpMessage(foundItem.name);
      parameters.imageUrl = foundItem.imageUrl;
      parameters.width = '60%';
      this.displayMessageService.openPopUp(parameters);
    }
  }

  selectStyle(selected: ReportStyles): void {
    this.localStorageService.setValue('style', selected.key);
    if (selected) {
      let foundItem = this.availableStyles.find(
        style => style.name === selected.name
      );
      if (foundItem) {
        this.availableStyles.forEach(element => {
          element.selected = false;
        });
        this.setSelectedItem(foundItem);
      }
    }
  }

  setSelectedItem(foundItem: ReportStyles): void {
    foundItem.selected = true;
    this.step.isComplete = true;
    this.selectedItem.emit(foundItem);
  }

  uploadedImage(event: any): void {
    //console.log(event);
  }

  changeClient(client: string): void {
    this.selectedClientEvent.emit(client);
    setTimeout(() => {
      this.selectedClientId = client;
      this.getLogoClient();
    });
    //Cargo filtros por genero
    this.loadGenderFilter(client);
    this.typeFiltersEvent.emit(this.typeFilterList);
  }

  changeSubbase(subbase: string): void {
    this.selectedSubbaseEvent.emit(subbase);
    setTimeout(() => {
      this.selectedSubbaseId = subbase;
    });
  }

  loadGenderFilter(clientId: string): void {
    this.gendersSub = this.gendersLoader
      .load(this.genderService.getGenders(clientId))
      .subscribe({
        next: (data: GenderResponse[]) => {
          //TODO: Revisar filtro si es necesario
          let genders = data.filter(gender => {
            return [0, 1, 2].includes(gender.idGender);
          });

          const GenderFilters: TypeFilterItem[] = genders.map(
            (gender: GenderResponse) => ({
              key: gender.idGender.toString(),
              name: gender.genderText,
            })
          );
          let idxGender = this.typeFilterList.findIndex(
            data => data.key === 'Gender'
          );
          if (idxGender > -1) {
            this.typeFilterList[idxGender].data = [...GenderFilters];
          } else {
            this.typeFilterList.unshift({
              key: 'Gender',
              name: 'Genero',
              data: GenderFilters,
            });
          }
        },
        error: err => {},
      });
  }

  loadStateConsistencyFilter(): void {
    const ConsistencyFilters: TypeFilterItem[] = Object.keys(Consistency)
      .filter(k => typeof Consistency[k] === 'string')
      .map(filter => ({ key: filter, name: Consistency[filter] }));
    this.typeFilterList.push({
      key: 'Consistency',
      name: 'Estado del assesment',
      data: ConsistencyFilters,
    });
  }
}
