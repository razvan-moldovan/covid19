import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {StatisticsService} from '../../../../services';
import {SharedService} from '../../../../services/shared.service';

@Component({
  selector: 'app-no2-emission',
  templateUrl: './no2-emission.component.html',
  styleUrls: ['./no2-emission.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class No2EmissionComponent implements OnInit {

  constructor(private StatisticsSvc: StatisticsService, private sharedService: SharedService) {
    this.sharedService.setMeta(
      'Emisii NO2',
      'harta emisii',
      `Harta emisii NO2`
    );
  }

  ngOnInit(): void {
  }

}
