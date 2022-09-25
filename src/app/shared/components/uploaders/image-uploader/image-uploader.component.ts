import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FileManagerService } from 'src/app/core/services/microservices/filemanager/filemanager.service';
import { Subscription, take } from 'rxjs';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { SnackBarMessage } from '../../display-message/displayMessage.interface';
import {
  ImageFileHandle,
  ImageSizingParameters,
} from './image-uploader.interface';
import {
  DataUrl,
  DOC_ORIENTATION,
  NgxImageCompressService,
} from 'ngx-image-compress';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from '../../../../core/services/microservices/client/client.service';
import { CustomerLogoReportRequest } from '../../../../core/services/microservices/client/client.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit, OnDestroy {
  //PARAMS
  @Input() validImageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ];
  @Input() maxMbSize: number = 12;
  @Input() dragAndDrop: boolean = true;
  @Input() imageSizingParameters: ImageSizingParameters;
  @Input() uploadFileName: string;
  @Input() title: string;
  @Input() description: string;

  @Input() selectedItemUrl: string;
  @Input() selectedClientId: string;

  @ViewChild('imageInput') imageInput: ElementRef;

  selectedFile: ImageFileHandle;

  @Output() uploadedImage = new EventEmitter<ImageFileHandle>();

  //Subscriptions
  uploaderSubscriber: Subscription;
  updateLogoSub: Subscription;

  constructor(
    private fileManagerService: FileManagerService,
    private displayMessageService: DisplayMessageService,
    private imageCompress: NgxImageCompressService,
    private translate: TranslateService,
    private clientService: ClientService
  ) {}
  ngOnInit(): void {
    if (this.selectedItemUrl) {
      this.selectedFile = new ImageFileHandle(this.selectedItemUrl, null);
    }
  }

  ngOnDestroy(): void {
    if (this.uploaderSubscriber) {
      this.uploaderSubscriber.unsubscribe();
    }
  }

  private onSuccess(): void {
    this.translate
      .get('UPLOADER.SUCCESSFUL_MESSAGE')
      .pipe(take(1))
      .subscribe((result: any) => {
        let success = new SnackBarMessage(result);
        success.duration = 4;
        this.displayMessageService.openSnackBar(success);
      });
    this.selectedFile.pending = false;
    this.selectedFile.status = 'SUCCESSFUL_STATUS';
    this.uploadedImage.emit(this.selectedFile);
  }

  private onError(message: string): void {
    this.translate
      .get(message)
      .pipe(take(1))
      .subscribe((result: any) => {
        this.showErrorDialog(result);
      });
  }

  dragAndDropClick(): void {
    this.imageInput.nativeElement.click();
  }

  processDragAndDropFile(imageInput: ImageFileHandle[]): void {
    if (imageInput[1] !== undefined) {
      this.translate
        .get('UPLOADER.ONLY_ONE_FILE_MESSAGE')
        .pipe(take(1))
        .subscribe((result: any) => {
          this.showErrorDialog(result);
        });
      return;
    }
    if (this.selectedFile) {
      this.revokePreviousURL(this.selectedFile.url);
    }

    this.selectedFile = imageInput[0];

    this.validateImage();
  }

  processFile(imageInput: any): void {
    if (imageInput.files.length < 1) {
      return;
    }
    if (imageInput.files.length > 1) {
      this.translate
        .get('UPLOADER.ONLY_ONE_FILE_MESSAGE')
        .pipe(take(1))
        .subscribe((result: any) => {
          this.showErrorDialog(result);
        });
      return;
    }
    if (this.selectedFile) {
      this.revokePreviousURL(this.selectedFile.url);
    }
    let file: File = imageInput.files[0];
    this.selectedFile = new ImageFileHandle(
      window.URL.createObjectURL(file),
      file
    );

    this.validateImage();
  }

  validFileFormatSize(): boolean {
    const imageFile = this.selectedFile;
    if (this.validImageTypes.indexOf(imageFile.file.type) === -1) {
      this.translate
        .get('UPLOADER.INVALID_FORMAT_TYPE')
        .pipe(take(1))
        .subscribe((result: string) => {
          this.showErrorDialog(
            result.replace('{INVALID_FORMAT_TYPE}', imageFile.file.type)
          );
        });
      return false;
    }
    if (imageFile.file.size > this.maxMbSize * 1000000) {
      this.translate
        .get('UPLOADER.INVALID_MAX_SIZE')
        .pipe(take(1))
        .subscribe((result: string) => {
          this.showErrorDialog(
            result.replace('{INVALID_MAX_SIZE}', this.maxMbSize.toString())
          );
        });
      return false;
    }
    return true;
  }

  validateImage(): void {
    if (!this.validFileFormatSize()) {
      this.selectedFile = null;
      return;
    }

    if (this.imageSizingParameters) {
      const img = new Image();
      img.src = this.selectedFile.url as string;
      img.onload = () => {
        const height = img.naturalHeight;
        const width = img.naturalWidth;
        this.selectedFile.width = width;
        this.selectedFile.height = height;
        if (
          this.imageSizingParameters.minWidth > width ||
          this.imageSizingParameters.minHeight > height
        ) {
          //console.log(width + ' ' + height);
          this.translate
            .get('UPLOADER.INVALID_IMAGE_MIN_RESOLUTION')
            .pipe(take(1))
            .subscribe((result: string) => {
              this.showErrorDialog(
                result.replace(
                  '{INVALID_IMAGE_MIN_RESOLUTION}',
                  `${this.imageSizingParameters.minWidth} x ${this.imageSizingParameters.minHeight}px`
                )
              );
            });
          return;
        }

        if (this.imageSizingParameters.checkSameImageProportion) {
          if (
            this.imageSizingParameters.minWidth / width !==
            this.imageSizingParameters.minHeight / height
          ) {
            this.translate
              .get('UPLOADER.INVALID_IMAGE_FORMAT')
              .pipe(take(1))
              .subscribe((result: string) => {
                this.showErrorDialog(result);
              });
            return;
          }
        }
        //If Everything ok
        this.uploadSelectedImage();
      };
    } else {
      this.uploadSelectedImage();
    }
  }

  compressFile(
    maxWidth?: number,
    maxHeight?: number,
    quality?: number, // Used for reducing JPEG image quality
    ratio?: number //Maximum scale factor as a percentage -- EJ: 50% Hasta cuanto reducir. Si se le pasa 50% trata de achicar a la mitad la imagen..
  ): Promise<void> {
    //SVG DOES NOT NEED RESIZING
    if (this.selectedFile.extensionType.includes('svg')) {
      return Promise.resolve();
    }
    //console.log('Pre Compresion Size Kb: ', this.selectedFile.size / 1000);

    return this.imageCompress
      .compressFile(
        this.selectedFile.base64
          ? this.selectedFile.base64
          : this.selectedFile.url,
        DOC_ORIENTATION.Default,
        ratio,
        quality,
        maxWidth,
        maxHeight
      )
      .then((result: DataUrl) => {
        const imagePath = this.dataURItoBlob(result);
        const newFile = new File([imagePath], this.selectedFile.file.name);
        //console.log('Post Compresion File FileSize Kb: ', newFile.size / 1000);

        //If new image is 105% larger, this compression is discarded
        if (
          newFile.size > this.selectedFile.file.size * 1.05 &&
          (!maxWidth || !maxHeight)
        ) {
          return;
        }
        this.selectedFile.file = newFile;
      });
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.toString().split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  uploadSelectedImage(): void {
    this.compressFile(
      undefined, //Compressing using only Height
      this.imageSizingParameters.maxHeight,
      50,
      100
    ).finally(() => {
      this.selectedFile.pending = true;
      this.selectedFile.status = 'UPLOADER.UPLOADING_STATUS';

      this.uploaderSubscriber = this.fileManagerService
        .uploadImage(this.selectedFile.file, this.uploadFileName, 'ClientLogo')
        .subscribe({
          next: res => {
            let pathLogo = res.substring(1);
            //Al guardar la imagen, guardo el path del logo
            this.updateClientLogo(pathLogo);
          },
          error: err => {
            console.log(err);
            this.onError('UPLOADER.FAILED_MESSAGE');
          },
        });
    });
  }

  updateClientLogo(pathLogo: string): void {
    let request: CustomerLogoReportRequest = {
      id: this.selectedClientId,
      logoPath: environment.apiFileManager + pathLogo,
    };
    this.updateLogoSub = this.clientService
      .updateClientLogo(request)
      .subscribe({
        next: data => {
          this.onSuccess();
        },
        error: err => {
          this.onError('UPLOADER.FAILED_UPDATING_MESSAGE');
        },
      });
  }

  showErrorDialog(message: string): void {
    this.displayMessageService.openSnackBar(new SnackBarMessage(message));
    this.selectedFile.pending = false;
    this.selectedFile.status = 'UPLOADER.FAILED_STATUS';
    this.selectedFile.url = '';
  }

  revokePreviousURL(url: string): void {
    window.URL.revokeObjectURL(url);
  }

  fromToWidth(): void {
    console.log('FROM', this.selectedFile.width, this.selectedFile.height);
    console.log(
      'TO',
      this.imageSizingParameters.maxWidth,
      this.imageSizingParameters.maxHeight
    );
  }
}
