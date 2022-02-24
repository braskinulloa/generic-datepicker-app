import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'generic-datepicker';
  buttonsItems = [
    {
      label: "120 Days",
      value: 120,
      icon: 'fa-solid fa-align-center'
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "5 Days",
      value: 5,
    }
  ];
  customStart: Date = new Date(2005, 11, 13, 12, 2, 2);
  customEnd: Date = new Date(2007, 3, 1, 2, 52, 54);
  useMobile: boolean | null = false;
  constructor() {}
  timeframeSelectedChanged(timeframe: Array<Date | string> | Date | string){
    console.log('Default =>', timeframe);
  }
  timeframeSelectedChangedUTC(timeframe: Array<string> | string){
    console.log('UTC =>', timeframe);
  }
  timeframeSelectedChangedISO(timeframe: Array<string> | string){
    console.log('ISO =>', timeframe);
  }
  timeframeSelectedChangedDate(timeframe: Array<Date | string> | Date | string){
    console.log('Date =>', timeframe);
  }
  boolNull(boo: boolean | null): boolean | null {
    switch (boo) {
      case true:
          return false;
        break;
      case false:
          return null;
        break;
      default:
          return true;
        break;
    }
  }
}
