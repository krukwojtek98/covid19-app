import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SummaryStatsService } from 'src/app/summary-stats.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentCachingComponent } from '../dialog-content-caching/dialog-content-caching.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private summaryStatsService: SummaryStatsService, public dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 503) {
                this.openDialog503();
            }
            else if (err.status === 502) {
              this.openDialog502();
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    openDialog503(): void {
        this.dialog.open(DialogContentCachingComponent, {
          maxWidth: '100%',
          maxHeight: '600px',
          disableClose: true,
          data: {
            header: 'ERROR 503',
            p1: 'The server is not responding',
            p2: 'Please refresh the page.',
            p3: ''
          }
        });
      }

      openDialog502(): void {
        this.dialog.open(DialogContentCachingComponent, {
          maxWidth: '100%',
          maxHeight: '600px',
          disableClose: true,
          data: {
            header: 'ERROR 502',
            p1: 'Bad gateway',
            p2: 'Please refresh the page.',
            p3: ''
          }
        });
      }
}
