import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {StatisticsService} from '../../../_services';
import {SharedService} from '../../../_services/shared-service.svc';

@Component({
  selector: 'app-frontier-situation',
  templateUrl: './frontier-situation.component.html',
  styleUrls: ['./frontier-situation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FrontierSituationComponent implements OnInit {

  constructor(private StatisticsSvc: StatisticsService, private sharedService: SharedService) {
    this.sharedService.setMeta(
      'Situatie la frontiere',
      'harta context european',
      `Situatie la frontiere`
    );
  }

  ngOnInit(): void {
  }

}
