import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  number: string;

  transform(value: number): string {
    this.number = value.toString();
    let threePlaces = 0;
    let newNumber = '';
    let newNumberTurnOver = '';

    for (let index =  this.number.length - 1; index  >= 0; index--) {
      if (threePlaces % 3 === 0){
        newNumber += ' ';
        newNumber += this.number[index];
        threePlaces = 0;
      }
      else {
        newNumber += this.number[index];
      }
      threePlaces++;
    }
    for (let index = newNumber.length - 1; index >= 0 ; index--) {
      newNumberTurnOver += newNumber[index];
    }

    return newNumberTurnOver;
  }

}
