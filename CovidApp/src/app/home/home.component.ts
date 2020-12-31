import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {SummaryStatsService} from 'src/app/summary-stats.service';
import { HttpClient } from '@angular/common/http';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import {Global} from 'src/models/global.model';
import { Color, Label, MultiDataSet  } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogContentCachingComponent } from '../dialog-content-caching/dialog-content-caching.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private summaryService: SummaryStatsService,
    private date1: DatePipe,
    public dialog: MatDialog
  ) { }

  globalStats: Global;
  date: string;
  showCards = false;

  newConfirmedChartShow = false;
  newRecoveredChartShow = false;
  newDeathsChartShow = false;
  newDoughnutChartShow = false;

  dataTocharts: Global[] = [];

  lineChartDataNewRecovered = [];
  lineChartLabelsNewRecovered: Label[] = [];

  lineChartDataNewConfirmed = [];
  lineChartLabelsNewConfirmed = [];

  lineChartDataNewDeaths = [];
  lineChartLabelsNewDeaths: Label[] = [];

  lineChartOptions = {
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontColor: 'black',
        fontSize: 14
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'white',
      }
      }],
      yAxes: [{
        ticks: {
          fontColor: 'white',
      }
      }]
    }
  };

  lineChartColorsNewConfirmed: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(217 181 13)',
    },
  ];
  lineChartColorsNewDeaths: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(255 57 57)',
    },
  ];
  lineChartColorsNewRecovered: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(26 182 26)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  doughnutChartData = [];
  doughnutChartLabels: Label[] = ['New confirmed', 'New Recovered', 'New Deaths'];

  doughnutChartOptions = {
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontColor: 'white',
        fontSize: 14
      }
    }
  };

  doughnutChartColors: Color[] = [
    {
      backgroundColor: ['rgb(217 181 13)', 'rgb(26 182 26)', 'rgb(255 57 57)'],
      borderColor: 'black',
    }
  ];

  doughnutChartLegend = true;
  doughnutChartType = 'doughnut';

  ngOnInit(): void {
    this.summaryService = new SummaryStatsService(this.http);

    merge()
          .pipe(
            startWith({}),
            switchMap(() => {
              return this.summaryService.getSummary();
            }),
            map(data => {
              if (data.Message === 'Caching in progress') {
                this.openDialog();
              }
              return data;
            }))
            .subscribe(
              data => {
                this.date = data.Date;
                this.globalStats = data.Global;
                this.showCards = true;
                merge()
                  .pipe(
                    startWith({}),
                    switchMap(() => {
                      return this.summaryService.getWorldStats(this.date);
                    }),
                    map(data1 => {
                      return data1;
                    }))
                    .subscribe(
                      data2 => {
                        this.dataTocharts = data2;
                        this.dataTocharts.sort( (a, b) => a.TotalConfirmed - b.TotalConfirmed);
                        this.createLineChartNewConfirmed(this.dataTocharts);
                        this.createLineChartNewRecovered(this.dataTocharts);
                        this.createLineChartNewDeaths(this.dataTocharts);
                        this.createDoughnutChart( this.globalStats);
                      },
                      error => {
                        console.log(error);
                      }
                    );
              },
              error => {
                console.log(error);
              }
            );

  }

  createLineChartNewRecovered(dataTocharts: Global[]): void {
    const data1 = [];
    this.lineChartDataNewRecovered = [];
    this.lineChartLabelsNewRecovered = [];
    const firstDate = new Date('2020-04-13');

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < dataTocharts.length; index++) {
      this.lineChartLabelsNewRecovered.push(this.date1.transform(firstDate.toString()));
      data1.push(dataTocharts[index].NewRecovered);
      firstDate.setDate(firstDate.getDate() + 1);
    }

    this.lineChartDataNewRecovered.push(
      {
        data: data1,
        label: 'New Recovered'
      }
    );
    this.newRecoveredChartShow = true;

  }


  createLineChartNewConfirmed(dataTocharts: Global[]): void {
    const data1 = [];
    this.lineChartDataNewConfirmed = [];
    this.lineChartLabelsNewConfirmed = [];
    const firstDate = new Date('2020-04-13');

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < dataTocharts.length; index++) {
      this.lineChartLabelsNewConfirmed.push(this.date1.transform(firstDate.toString()));
      data1.push(dataTocharts[index].NewConfirmed);
      firstDate.setDate(firstDate.getDate() + 1);
    }

    this.lineChartDataNewConfirmed.push(
      {
        data: data1,
        label: 'New Confirmed'
      }
    );
    this.newConfirmedChartShow = true;

  }

  createLineChartNewDeaths(dataTocharts: Global[]): void {
    const data1 = [];
    this.lineChartDataNewDeaths = [];
    this.lineChartLabelsNewDeaths = [];
    const firstDate = new Date('2020-04-13');

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < dataTocharts.length; index++) {
      this.lineChartLabelsNewDeaths.push(this.date1.transform(firstDate.toString()));
      data1.push(dataTocharts[index].NewDeaths);
      firstDate.setDate(firstDate.getDate() + 1);
    }

    this.lineChartDataNewDeaths.push(
      {
        data: data1,
        label: 'New Deaths'
      }
    );

    this.newDeathsChartShow = true;

  }

  createDoughnutChart(dataTocharts: Global): void {
    this.doughnutChartData = [
      { data:
         [
           dataTocharts.NewConfirmed,
           dataTocharts.NewRecovered,
           dataTocharts.NewDeaths]}
    ];

    this.newDoughnutChartShow = true;
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

