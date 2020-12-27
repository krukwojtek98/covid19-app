import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {SummaryStatsService} from 'src/app/summary-stats.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import {Global} from 'src/models/global.model';
import { DialogContentCachingComponent } from './dialog-content-caching/dialog-content-caching.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'CovidApp';
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  date: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private http: HttpClient,
    public dialog: MatDialog,
    private summaryService: SummaryStatsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }


  ngOnInit(): any {
    this.summaryService = new SummaryStatsService(this.http);

    merge()
          .pipe(
            startWith({}),
            switchMap(() => {
              return this.summaryService.getSummary();
            }),
            map(data => {
              // if (data.Message === 'Caching in progress') {
              //   console.log('Test buforu');
              //   this.openDialog();
              // }
              return data;
            }))
            .subscribe(
              data => {
                this.date = data.Date;
              },
              error => {
                console.log(error);
              }
            );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  openDialog(): void {
    this.dialog.open(DialogContentCachingComponent, {
      maxWidth: '100%',
      maxHeight: '600px',
      disableClose: true,
      data: {
        header: 'Caching in progress',
        p1: 'Data buffering is in progress.',
        p2: 'The site will start working again in a moment.',
        p3: 'Please refresh the page.'
      }
    });
  }
}
