import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeeMoreData } from './interfaces/seeMoreData.interface';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss'],
})
export class SeeMoreComponent implements OnInit {
  isArray: boolean;
  constructor(
    public dialogRef: MatDialogRef<SeeMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SeeMoreData
  ) {}

  ngOnInit(): void {
    this.isArray = Array.isArray(this.data.description);
  }

  //Methods modal
  closePopUp(): void {
    this.cancel();
  }

  cancel(): void {
    this.close(false);
  }
  close(value: any): void {
    this.dialogRef.close(value);
  }
  confirm(): void {
    this.close(true);
  }
}
