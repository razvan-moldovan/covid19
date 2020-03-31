import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {SharedService} from '../../../services/shared.service';
import {DashboardService} from '../../../services';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  constructor(private sharedService: SharedService, private dashboardService: DashboardService) {
    this.sharedService.setMeta(
      null,
      'dashboard, covid, românia, cazuri confirmate',
      'Dashboard interactiv despre cazurile COVID19 confirmate în România'
    );
  }

  ngOnInit() { }

}
