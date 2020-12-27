import { AnonymousSubject } from 'rxjs/internal/Subject';

export interface CountryApi {
    Global: any;
    Countries: Countries[];
    Message: string;
    Date: string;
}

export interface Countries {
    Country: string;
    CountryCode: string;
    Slug: string;
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: string;
    Premium: any;
}
