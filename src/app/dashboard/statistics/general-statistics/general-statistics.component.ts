import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import * as regression from 'regression';
import * as palette from 'google-palette';
import * as pluginPiechartOutlabels from 'chartjs-plugin-piechart-outlabels';
import * as pluginAnnotation from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-general-statistics',
  templateUrl: './general-statistics.component.html',
  styleUrls: ['./general-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralStatisticsComponent implements OnInit {
  @ViewChild('canvasDailyCases', {static: true}) canvasDailyCases: ElementRef;
  @ViewChild('canvasDistributionBySex', {static: true}) canvasDistributionBySex: ElementRef;
  @ViewChild('canvasFreqByGeneration', {static: true}) canvasFreqByGeneration: ElementRef;
  @ViewChild('canvasFreqByAge', {static: true}) canvasFreqByAge: ElementRef;
  @ViewChild('canvasTrendline', {static: true}) canvasTrendline: ElementRef;
  @ViewChild('mainGrid', {static: true}) mainGrid: ElementRef;

  chartColors : any = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }

  constructor() { }

  ngOnInit(): void {
    Chart.scaleService.updateScaleDefaults('linear', {
        ticks: {
            min: 0
        }
    });

    this.drawCharts1();
    this.drawCharts2();
  }

  drawCharts1(){
    let self = this;

    let configDailyCases = {
      type: 'line',
			data: {
				//labels: [],
				datasets: [{
					label: 'Cazuri unice',
					backgroundColor: this.chartColors.blue,
					borderColor: this.chartColors.blue,
					data: [],
					fill: false
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
                    text: 'Cazuri pe zile',
                    fontSize: 18
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
              type: 'time',
              time: {
                  format: 'YYYY-MM-DD',
                  tooltipFormat: 'll',
                  unit: 'day',
                  unitStepSize: 5
              },
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Data'
						}
					}],
					yAxes: [{
						//display: true,
						scaleLabel: {
							display: true,
							labelString: 'Cazuri'
						}
					}]
				}
			}
    };

    var configTrendline = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Cazuri confirmate',
                    backgroundColor: this.chartColors.yellow,
                    borderColor: this.chartColors.yellow,
                    data: [],
                    fill: false,
                    // showLine: false,
                    borderWidth: 3
                }
            ]
        },
        plugins: {
            pluginAnnotation
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: 'Ziua față de cazuri cumulative',
                fontSize: 18
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Ziua'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cumulativ'
                    }
                }]
            },
            annotation: {
                drawTime: 'beforeDatasetsDraw',
                annotations: [
                    {
                        id: 'masura-3',
                        type: 'line',
                        mode: 'vertical',
                        borderDash: [2, 2],
                        scaleID: 'x-axis-0',
                        value: '24',
                        borderColor: 'rgba(51,51,153,0.8)',
                        borderWidth: 2,
                        label: {
                            backgroundColor: 'rgba(51,51,153,0.8)',
                            position: "top",
                            content: "OM 2",
                            enabled: true,
                            yPadding: 2
                        }
                    },
                    {
                        id: 'masura-2',
                        type: 'line',
                        mode: 'vertical',
                        borderDash: [2, 2],
                        scaleID: 'x-axis-0',
                        value: '19',
                        borderColor: 'black',
                        borderWidth: 2,
                        label: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            position: "top",
                            content: "Stare de Urgenta",
                            enabled: true,
                            yPadding: 2
                        }
                    },
                    {
                        id: 'masura-1',
                        type: 'line',
                        mode: 'vertical',
                        borderDash: [2, 2],
                        scaleID: 'x-axis-0',
                        value: '14',
                        borderColor: 'green',
                        borderWidth: 2,
                        label: {
                            backgroundColor: 'green',
                            position: "top",
                            content: "Inchidere Scoli/Gradinite",
                            enabled: true,
                            yPadding: 2
                        },
                    }
                ]
            }
        }
    };

    $.getJSON({
        url: '/api/dashboard/getDailyCaseReport',
        success: function(data) {
            let _data = data.data.data;
            let _datasets = [];
            let _trendline = { x: [], y: [], pairs: [], dates: [] };
    
            for (let i=0; i<_data.length; i++) {
                _datasets.push({x: _data[i]['day_case'], y: _data[i]['new_case_no']});

                _trendline.x.push(_data[i]['day_no']);
                _trendline.y.push(_data[i]['total_case']);
                _trendline.dates.push(_data[i]['day_case']+' ['+_data[i]['day_no']+']')
                _trendline.pairs.push([_data[i]['day_no'], _data[i]['total_case']]);
            }
    
            // Cazuri pe zile
            configDailyCases['data']['datasets'][0]['data'] = _datasets;
            let ctxDailyCases = self.canvasDailyCases.nativeElement.getContext('2d');

            if(self.mainGrid.nativeElement.offsetWidth < 550){
                ctxDailyCases.canvas.height = 300;
            }

            let myLine = new Chart(ctxDailyCases, configDailyCases);
    
            // Ziua fata de cazuri cumulative
            let _ds = [
                { 
                    'values': regression.exponential(_trendline.pairs),
                    'function': 'Creștere exponențială',
                    'visible': true
                }, 
                {
                    'values': regression.logarithmic(_trendline.pairs),
                    'function': 'Creștere logaritmică',
                    'visible': false
                },
                {
                    'values': regression.linear(_trendline.pairs),
                    'function': 'Creștere liniara',
                    'visible': false
                }
            ];
    
            let pal = palette('tol-rainbow', _ds.length).map(function(hex){return '#' + hex;});
    
            let pointsds = [];
    
            for (var i in _ds) {
                if (_ds[i].visible) {
                    pointsds[i] = [];

                    for (var j in _ds[i].values.points) {
                        pointsds[i].push(_ds[i].values.points[j][1]);
                    }
                    
                    let dss: any = {};
                    dss.label = _ds[i].function + ' [ ' + _ds[i].values.string + ' R^2='+_ds[i].values.r2 + ' ]';
                    dss.backgroundColor = pal[i];
                    dss.data = pointsds[i];
                    dss.fill = false;
                    dss.borderColor = pal[i];
                    dss.borderWidth = 1;
                    dss.pointRadius = 0;
                    
                    configTrendline['data']['datasets'].push(dss);
                }
            }
    
            configTrendline['data']['labels'] = _trendline.dates;
            configTrendline['data']['datasets'][0]['data'] = _trendline.y;
    
            var ctxTrendline = self.canvasTrendline.nativeElement.getContext('2d');
            if(self.mainGrid.nativeElement.offsetWidth < 550){
                ctxTrendline.canvas.height = 320;
                ctxTrendline.canvas.width = self.mainGrid.nativeElement.offsetWidth - 10;
            } else {
                ctxTrendline.canvas.height = 700;
                ctxTrendline.canvas.width = self.mainGrid.nativeElement.offsetWidth - 50;
            }
            myLine = new Chart(ctxTrendline, configTrendline);
            }
        });
  }

  drawCharts2(){
    let self = this;

    // by type intervals
    let _bti = {
        'silent': {
            intervals: {
                'min': 74,
                'max': 150
            },
            count: 0,
            label: 'The Silent Generation'
        },
        'babyboomers': {
            intervals: {
                'min': 55,
                'max': 73,
            },
            count: 0,
            label: 'Baby Boomers'
        },
        'generationx': {
            intervals: {
                'min': 39,
                'max': 54,
            },
            count: 0,
            label: 'Generation X'
        },
        'millennials': {
            intervals: {
                'min': 23,
                'max': 38,
            },
            count: 0,
            label: 'Millennials'
        },
        'generationz': {
            intervals: {
                'min': 10,
                'max': 22,
            },
            count: 0,
            label: 'Generation Z'
        }
    }

    var configFreqByGeneration = {
      type: 'outlabeledPie',
      data: {
          labels: [],
          datasets: [{
              backgroundColor: [self.chartColors.orange, self.chartColors.green, self.chartColors.yellow, self.chartColors.red, self.chartColors.blue ],
              data: []
          }]
      },
      plugins: {
        pluginPiechartOutlabels 
      },
      options: {
          zoomOutPercentage: 50,
          responsive: true,
          title: {
            display: true,
            text: 'Frecvența după generație',
            fontSize: 18
          },
          legend: {
            display: false
          },
          display: true,
            elements: {
          },
          plugins: {
              legend: false,
              outlabels: {
                  text: '%l %p',
                  color: 'white',
                  stretch: 45,
                  font: {
                      resizable: true,
                      minSize: 12,
                      maxSize: 18
                  }
              }
          }
      }
    }

    var configDistributionBySex = {
      type: 'doughnut',
      data: {
          labels: ['Feminin', 'Masculin',  'Copii < 18'],
          datasets: [
            {
              backgroundColor: [self.chartColors.red, self.chartColors.blue, self.chartColors.green],
              data: []
            }
          ]
      },
      options: {
          resposive: true,
          title: {
              display: true,
              text: 'Distribuție după gen',
              fontSize: 18
          },
          legend: {
            display: false
          },
          display: true,
        elements: {}
      }
    }

    var configFreqByAge = {
			type: 'bar',
			data: {
				labels: [],
				datasets: [
          {
            label: 'Grupe de vârstă',
            backgroundColor: self.chartColors.blue,
            borderColor: self.chartColors.blue,
            data: [],
            fill: false
          }
        ]
			},
			options: {
				responsive: true,
				title: {
					display: true,
                    text: 'Frecvența pe grupe de vârstă',
                    fontSize: 18
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Interval Vârstă'
						}
					}],
					yAxes: [{
						//display: true,
						scaleLabel: {
							display: true,
							labelString: 'Frecvența'
						}
					}]
				}
			}
    };

    $.getJSON({
        url: '/api/dashboard/getCasesByAgeGroup',
        success: function(data) {
            let _data = data.data;
            configFreqByAge.options.title.text += ' ['+_data.timestamp+']';
            for (var e in _data) {
                if (e != 'timestamp') {
                    configFreqByAge.data.datasets[0].data.push(_data[e]);
                    configFreqByAge.data.labels.push(e.replace('g', '').replace('plus', ''));
                }
            }

            /*
            for (var e in Object.keys(_bai)){
                var k = Object.keys(_bai)[e];
                configFreqByAge.data.datasets[0].data.push(_bai[k].count);
                configFreqByAge.data.labels.push(_bai[k].label);
            }
            */

            var ctxFBA = self.canvasFreqByAge.nativeElement.getContext('2d');
            if (self.mainGrid.nativeElement.offsetWidth < 550) {
                ctxFBA.canvas.height = 320;
            }
            let myGraph3 = new Chart(ctxFBA, configFreqByAge);
        }
    });

    $.getJSON({
        url: '/api/dashboard/getPercentageByGender',
        success: function(data) {
            let _data = data.data;
            configDistributionBySex.options.title.text += ' ['+_data.timestamp+']';
            configDistributionBySex.data.datasets[0].data = [
                (_data['feminim']).toFixed(2),
                (_data['masculin']).toFixed(2),
                (_data['copii']).toFixed(2)
            ];
            var ctxDBS = self.canvasDistributionBySex.nativeElement.getContext('2d');
            if(self.mainGrid.nativeElement.offsetWidth < 550){
              ctxDBS.canvas.height = 220;
              }
            let myGraph1 = new Chart(ctxDBS, configDistributionBySex);
        }
    });
    
    $.getJSON({
      url: '/api/statistics/getCaseRelations',
      success: function(data) {
          let _data = data.data.nodes,
          _women = 0,
          _men = 0,
          _total = _data.length,
          myLine;
          
        for (let i=0; i<_data.length; i++) {
            if (_data[i].properties.gender == 'Bărbat') {
                _men += 1;
            } else {
                _women += 1;
            }
            for (var e in Object.keys(_bti)){
                var _k = Object.keys(_bti)[e];
                if (_data[i].properties.age != null) {
                    if (_data[i].properties.age >= _bti[_k].intervals.min && _data[i].properties.age <= _bti[_k].intervals.max) {
                        _bti[_k].count += 1;
                    }
                }
            }
        }
          
          for (var e in Object.keys(_bti)){
              var k = Object.keys(_bti)[e];
              configFreqByGeneration.data.datasets[0].data.push(_bti[k].count);
              configFreqByGeneration.data.labels.push(_bti[k].label);
          }

          /*
          var ctxFBG = self.canvasFreqByGeneration.nativeElement.getContext('2d');
          if(self.mainGrid.nativeElement.offsetWidth < 550){
            ctxFBG.canvas.height = 210;
            }
          let myGraph2 = new Chart(ctxFBG, configFreqByGeneration);
          */
        }
  });
  }

}
