import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    let newDate = '';
    let newDate2 = '';
    if ( value !== null && value !== '') {
      newDate = value.replace('T', ' ');
      newDate2 = newDate.replace('Z', ' ');
      newDate2 += '( UTC +0 )';
      return newDate2;
    }
  }

}
