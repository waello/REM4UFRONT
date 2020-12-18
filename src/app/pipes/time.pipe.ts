import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    let h = Math.floor(value / 3600);
    let m = Math.floor(value % 3600 / 60);
    let s = Math.floor(value % 3600 % 60);

    // return h+':'+m+':'+s;
    return (h  ? (h+' h ') : '') + (m  ? (m+' min ') : '') +  (s  ? (s+' s ') : '');
  }

}
