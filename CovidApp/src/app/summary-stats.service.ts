import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CountryApi} from 'src/models/country.model';
import {CountryLive, CountryLiveArray} from 'src/models/liveCountry.model';
import { Global } from 'src/models/global.model';


@Injectable({
  providedIn: 'root'
})
export class SummaryStatsService {

  constructor(private http: HttpClient) { }

  getSummary(): Observable<any> {
    return this.http.get<any>('https://api.covid19api.com/summary');
  }

  getCountry(): Observable<CountryApi> {
    return this.http.get<CountryApi>('https://api.covid19api.com/summary');
  }

  getCountryLiveAllStats(country: string): Observable<CountryLive[]> {
    return this.http.get<CountryLive[]>('https://api.covid19api.com/total/country/' + country);
  }

  getWorldStats(date: string): Observable<Global[]> {
    console.log(date);
    return this.http.get<Global[]>('https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to=' + date);
  }
}
