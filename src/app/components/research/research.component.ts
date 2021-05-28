import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DBApiService } from 'src/app/services/dbapi.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  startDate: any
  endDate: any
  hasData: boolean
  appData: any[]
  amountTotals: any
  countTotals: any

  graphSize: any[] = [500,500]

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Orders';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  dailyData = [
    {
      "name": "Orders",
      "series": []
    },
    {
      "name": "Sales",
      "series": []
    }
  ];
  

  constructor(
    private apiService : DBApiService
  ) { 

  }

  ngOnInit() {
    const s = moment().add(-1, 'months');
    this.startDate = {year:s.year(), month:s.month()+1, day:s.date()};
    const e = moment();
    this.endDate = {year:e.year(), month:e.month()+1, day:e.date()};
    this.loadData();
  }

  async loadData() {
    this.hasData = false;
    this.amountTotals = {};
    this.countTotals = {};
    this.appData = [];

    const sd = this.startDate;
    const fromDate = `${sd.year}-${sd.month.toString().padStart(2, '0')}-${sd.day.toString().padStart(2, '0')} 00:00:00`;
    const ed = this.endDate;
    const toDate = `${ed.year}-${ed.month.toString().padStart(2, '0')}-${ed.day.toString().padStart(2, '0') } 23:59:59`;
    const data : any = await this.apiService.fetchOrderStats(fromDate, toDate);
    console.log(data);
    this.appData = [];

    const apps = {};
    const sthLookup = {};
    const storeLookup = {};
    data.sth.forEach(d => { 
      apps[d.app_name] = true; 
      sthLookup[d.app_name] = d;
    });
    data.store.forEach(d => { 
      apps[d.app_name] = true; 
      storeLookup[d.app_name] = d;
    });


    Object.keys(apps).forEach(app_name => {
      const d = app_name in storeLookup ? storeLookup[app_name] : {app_name, count:0, amount:0};
      const app = this.appLookup(d.app_name);
      const store = this.storeLookup(d.app_name);
      d.app = app;
      d.store = store;
      this.appData.push(d);

      const storeKey = `store-${store}`;
      const sthKey = `sth-${store}`;
      if (!(storeKey in this.amountTotals)) {
        this.amountTotals[storeKey] = 0;
        this.countTotals[storeKey] = 0;
        this.amountTotals[sthKey] = 0;
        this.countTotals[sthKey] = 0;
      }

      this.amountTotals[storeKey] += d.amount;
      this.countTotals[storeKey] += parseInt(d.count);

      const sthd = sthLookup[d.app_name];
      if (sthd) {
        d.sth_count = sthd.count;
        d.sth_amount = sthd.amount;
        this.amountTotals[sthKey] += sthd.amount;
        this.countTotals[sthKey] += parseInt(sthd.count);
      } else {
        d.sth_count = 0;
        d.sth_amount = 0;
      }
    });
    const dayCountSeriesData = [];
    const dayAmountSeriesData = [];
    data.days.forEach(d => {
      const md = d.ymd.substring(2);
      dayCountSeriesData.push({name: md, value: d.count});
      dayAmountSeriesData.push({name: md, value: d.amount});
    });
    this.dailyData[0].series = dayCountSeriesData;
    this.dailyData[1].series = dayAmountSeriesData;

    this.appData.sort((d1,d2) => d2.store.localeCompare(d1.store) || d2.amount-d1.amount);
    this.hasData = true;
  }

  storeLookup(bundleName) : string {
    switch (bundleName) {
      case 'com.jpeglabs.photoprint': return 'Walgreens';
      case 'com.jpeglabs.Photo-Prints-Walgreens-Printing-Photos-CVS': return 'Walgreens';
      case 'com.jpeglabs.printasa.ios': return 'Walgreens';
      case 'com.jpeglabs.printmatic.cvs.ios': return 'CVS';
      case 'com.jpeglabs.Print-Photos-Walgreens-Printing-Photos-COSTCO': return 'Walgreens';
      case 'com.jpeglabs.photoprinting.cvs': return 'CVS';
      case 'com.pixelpanels.instaprinty.ios': return 'Walgreens';
      case 'instaprinty-cvs-ios': return 'CVS';
      case 'com.jpeglabs.photoprinting': return 'Walgreens';
      case 'photoprinty-walgreens-ios': return 'Walgreens';
      default: return '(unknown store)';
    }
  }
  appLookup(bundleName) : string {
    switch (bundleName) {
      case 'com.jpeglabs.photoprint': return 'Android Fast';
      case 'com.jpeglabs.Photo-Prints-Walgreens-Printing-Photos-CVS': return 'EZPrints';
      case 'com.jpeglabs.printasa.ios': return 'Printasa';
      case 'com.jpeglabs.printmatic.cvs.ios': return 'Printmatic';
      case 'com.jpeglabs.Print-Photos-Walgreens-Printing-Photos-COSTCO': return 'FastPrints';
      case 'com.jpeglabs.photoprinting.cvs': return 'Android CVS #2';
      case 'com.pixelpanels.instaprinty.ios': return 'TotPhoto';
      case 'com.jpeglabs.photoprinting': return 'Android EZ';
      case 'instaprinty-cvs-ios': return 'Android CVS #1';
      case 'photoprinty-walgreens-ios': return 'Photoprinty';
      default: return bundleName;
    }
  }
}
