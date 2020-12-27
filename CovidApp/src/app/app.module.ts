import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from './home/home.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormatNumberPipe } from './format-number.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateFormatPipe } from './date-format.pipe';
import { CountryComponent } from './country/country.component';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {ErrorInterceptor} from 'src/app/interceptors/error.interceptor';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogContentCachingComponent } from './dialog-content-caching/dialog-content-caching.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormatNumberPipe,
    DateFormatPipe,
    CountryComponent,
    DialogContentCachingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    ChartsModule,
    MatTabsModule,
    MatDialogModule
  ],
  providers: [
    DateFormatPipe,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DialogContentCachingComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
