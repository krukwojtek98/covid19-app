import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content-caching',
  templateUrl: './dialog-content-caching.component.html',
  styleUrls: ['./dialog-content-caching.component.css']
})
export class DialogContentCachingComponent implements OnInit {

  header: string;
  p1: string;
  p2: string;
  p3: string;

  constructor(public dialogRef: MatDialogRef<DialogContentCachingComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.header = data.header;
    this.p1 = data.p1;
    this.p2 = data.p2;
    this.p3 = data.p3;
   }

  ngOnInit(): void {
  }

}
