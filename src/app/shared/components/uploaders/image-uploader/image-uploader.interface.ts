export class ImageFileHandle {
  pending: boolean = false;
  status: string = 'init';
  size: number;
  extensionType: string;
  fileName: string;
  width: number;
  height: number;
  base64: string;

  constructor(public url: string, public file: File) {
    if (file) {
      this.fileName = file.name;
      this.size = file.size;
      this.extensionType = file.type;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64 = reader.result.toString();
      };
    }
  }
}

export interface ImageSizingParameters {
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  checkSameImageProportion: boolean;
}
