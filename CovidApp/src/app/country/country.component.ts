import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {SummaryStatsService} from 'src/app/summary-stats.service';
import { HttpClient } from '@angular/common/http';
import {catchError, startWith, map, switchMap } from 'rxjs/operators';
import { Observable, merge, of as observableOf } from 'rxjs';
import {Countries, CountryApi} from 'src/models/country.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CountryLive } from 'src/models/liveCountry.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { DateFormatPipe } from '../date-format.pipe';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DialogContentCachingComponent } from '../dialog-content-caching/dialog-content-caching.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient, private dateFormat: DateFormatPipe, public dialog: MatDialog) { }


  displayedColumns: string[] = ['select', 'Country', 'Total confirmed', 'New confirmed', 'Total deaths', 'New deaths', 'Total recovered', 'New recovered'];
  summaryService: SummaryStatsService | null;

  countryStats: Countries[] = [];
  // dataFromCheckbox = [];
  dataSource = new MatTableDataSource<Countries>();
  selection = new SelectionModel<Countries>(false);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  countryLiveStats: CountryLive[] = [];

  showChartActive = false;
  showChartConfirmed = false;
  showChartDeaths = false;
  showChartRecovered = false;

  showChartsTabs = false;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('TABLE') table: ElementRef;
  lineChartDataActive = [];
  lineChartLabelsActive: Label[] = [];

  lineChartDataConfirmed = [];
  lineChartLabelsConfirmed: Label[] = [];

  lineChartDataDeaths = [];
  lineChartLabelsDeaths: Label[] = [];

  lineChartDataRecovered = [];
  lineChartLabelsRecovered: Label[] = [];

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

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.summaryService = new SummaryStatsService(this.http);
    merge()
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              // tslint:disable-next-line:no-non-null-assertion
              return this.summaryService!.getCountry();
            }),
            map(data => {
              this.isLoadingResults = false;
              this.isRateLimitReached = false;
              if (data.Message === 'Caching in progress') {
                console.log('Test buforu');
                this.openDialog();
              }
              return data.Countries;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              this.isRateLimitReached = true;
              return observableOf([]);
            }))
            .subscribe(
              data => {
                // this.countryStats = data;
                this.dataSource.data = data.slice();
                this.dataSource.sort = this.sort;
              },
              error => {
                console.log(error);
              }
            );
  }

  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getValue(): void {
    this.selection.changed.asObservable().subscribe( a => {
      if (a.added.length !== 0){
        const country = a.added.pop();
        this.showCharts(country.Slug);
      }
    });
  }

  showCharts(country: string): void {
    console.log(country);
    this.summaryService = new SummaryStatsService(this.http);
    merge()
          .pipe(
            startWith({}),
            switchMap(() => {
              // tslint:disable-next-line:no-non-null-assertion
              return this.summaryService!.getCountryLiveAllStats(country);
            }),
            map(data => {
              return data;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              this.isRateLimitReached = true;
              return observableOf([]);
            }))
            .subscribe(
              data => {
                this.countryLiveStats = data;
                this.createLineChartActive(this.countryLiveStats);
                this.createLineChartConfirmed(this.countryLiveStats);
                this.createLineChartDeaths(this.countryLiveStats);
                this.createLineChartRecovered(this.countryLiveStats);

                console.log(this.countryLiveStats);
              },
              error => {
                console.log(error);
              }
            );
  }

  createLineChartActive(countriesStats: CountryLive[]): void {
    const data1 = [];
    this.lineChartDataActive = [];
    this.lineChartLabelsActive = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < countriesStats.length; index++) {
      this.lineChartLabelsActive.push(countriesStats[index].Date);
      data1.push(countriesStats[index].Active);
    }
    this.lineChartDataActive.push(
      {
        data: data1,
        label: 'Active'
      }
    );
    this.showChartActive = true;
    this.showChartsTabs = true;

  }

  createLineChartConfirmed(countriesStats: CountryLive[]): void {
    const data1 = [];
    const data2 = [];
    const data3 = [];

    this.lineChartDataConfirmed = [];
    this.lineChartLabelsConfirmed = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < countriesStats.length; index++) {
      this.lineChartLabelsConfirmed.push(this.dateFormat.transform( countriesStats[index].Date));
      data1.push(countriesStats[index].Confirmed);
      data2.push(countriesStats[index].Recovered);
      data3.push(countriesStats[index].Deaths);
    }
    this.lineChartDataConfirmed.push(
      {
        data: data1,
        label: 'Confirmed',
      },
      {
        data: data2,
        label: 'Recovered'
      },
      {
        data: data3,
        label: 'Deaths'
      }
    );
    this.showChartConfirmed = true;
    this.showChartsTabs = true;

  }

  createLineChartDeaths(countriesStats: CountryLive[]): void {
    const data1 = [];
    this.lineChartDataDeaths = [];
    this.lineChartLabelsDeaths = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < countriesStats.length; index++) {
      this.lineChartLabelsDeaths.push(this.dateFormat.transform( countriesStats[index].Date));
      data1.push(countriesStats[index].Deaths);
    }
    this.lineChartDataDeaths.push(
      {
        data: data1,
        label: 'Deaths'
      }
    );
    this.showChartDeaths = true;
    this.showChartsTabs = true;

  }

  createLineChartRecovered(countriesStats: CountryLive[]): void {
    const data1 = [];
    this.lineChartDataRecovered = [];
    this.lineChartLabelsRecovered = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < countriesStats.length; index++) {
      this.lineChartLabelsRecovered.push(this.dateFormat.transform( countriesStats[index].Date));
      data1.push(countriesStats[index].Recovered);
    }
    this.lineChartDataRecovered.push(
      {
        data: data1,
        label: 'Recovered'
      }
    );
    this.showChartRecovered = true;
    this.showChartsTabs = true;

  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'test.xlsx');
  }

  exportToPdf(): void {
    const tmpFull = [];
    this.dataSource.data.forEach( e => {
      const tmp2 = [];
      tmp2.push(e.Country);
      tmp2.push(e.TotalConfirmed);
      tmp2.push(e.NewConfirmed);
      tmp2.push(e.TotalDeaths);
      tmp2.push(e.NewDeaths);
      tmp2.push(e.TotalRecovered);
      tmp2.push(e.NewRecovered);
      tmpFull.push(tmp2);
    });
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Country', 'Total Confirmed', 'New Confirmed', 'Total Deaths', 'New Deaths', 'Total Recovered', 'New Recovered']],
      body: tmpFull
    });
    doc.save('testPDF.pdf');
  }

  sortData(sort: Sort): void {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Country': return compare(a.Country, b.Country, isAsc);
        case 'Total confirmed': return compare(a.TotalConfirmed, b.TotalConfirmed, isAsc);
        case 'New confirmed': return compare(a.NewConfirmed, b.NewConfirmed, isAsc);
        case 'Total deaths': return compare(a.TotalDeaths, b.TotalDeaths, isAsc);
        case 'New deaths': return compare(a.NewDeaths, b.NewDeaths, isAsc);
        case 'Total recovered': return compare(a.TotalRecovered, b.TotalRecovered, isAsc);
        case 'New recovered': return compare(a.NewRecovered, b.NewRecovered, isAsc);

        default: return 0;
      }
    });
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

// tslint:disable-next-line:typedef
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
