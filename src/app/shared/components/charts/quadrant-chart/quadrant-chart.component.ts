import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import 'anychart';

import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-quadrant-chart',
  templateUrl: './quadrant-chart.component.html',
  styleUrls: ['./quadrant-chart.component.scss']
})
export class QuadrantChartComponent implements OnInit, AfterViewInit { chart!: any;
   series1!: any;
  
  @ViewChild('chartContainer') container: any; //Esto viene del div

  constructor() { }

  ngOnInit(): void {
   
    

 
    let data = [
      {x: 1, value: 4, name: "FM", fill:"#007efd"},
      {x: 1, value: 2, name: "DC"},
      {x: 2, value: 4, name: "JC"},
      {x: 3, value: 5, name: "DK"},
      {x: 5, value: 4, name: "JB"}      
    ];
  
  	let data2 = [
      {x: -1, value: 2, name: "DC"},
      {x: -2, value: 4, name: "JB"},
      {x: -2, value: 2, name: "FM", fill:"#007efd"},
      {x: -3, value: 5, name: "DK"},
      {x: -4, value: 4, name: "JC"},
    ]
    
  	let data3 = [
      {x: -1, value: -2, name: "DC"},
      {x: -2, value: -4, name: "JB"},
      {x: -3, value: -3, name: "JC"},
      {x: -2, value: -2, name: "DK"},
      {x: -1, value: -5, name: "FM", fill:"#007efd"},
    ]
    
    let data4 = [
      {x: 2, value: -2, name: "DC"},
      {x: 4, value: -1, name: "FM", fill:"#007efd"},  
      {x: 3, value: -5, name: "DK"},
      {x: 4, value: -4, name: "JC"},
      {x: 1, value: -3, name: "JB"}
    ]

    // create a chart
    this.chart = anychart.quadrant();


  	this.series1 = this.chart.marker(data);
  	this.series1.normal().type("circle");
  	this.series1.normal().fill("#FFD100");
  	this.series1.normal().stroke(false);
  
  	var series2 = this.chart.marker(data2);
  	series2.normal().type("circle");
  	series2.normal().fill("#FF6819");
  	series2.normal().stroke(false);
  
  	var series3 = this.chart.marker(data3);
  	series3.normal().type("circle");
  	series3.normal().fill("#2FB039");
  	series3.normal().stroke(false);
  
  	var series4 = this.chart.marker(data4);
  	series4.normal().type("circle");
  	series4.normal().fill("#27ACF7");
  	series4.normal().stroke(false);

  	
    
 
  	// custom label
  	this.chart.labels(true);
  	this.chart.labels().format("{%name}");
  
  	// scale quadrant
  	this.chart.yScale().minimum(-6);
    this.chart.yScale().maximum(6);
    this.chart.xScale().minimum(-6);
    this.chart.xScale().maximum(6);
  
	//chart.yScale().minimum(-100);
	//chart.yScale().maximum(100);
	//chart.xScale().minimum(-100);
	//chart.xScale().maximum(100);

  	this.chart.xAxis(0, {ticks: true, labels: false, stroke: '#ffffff', title: { text: 'Receptivo', align: 'center' }});
    this.chart.xAxis(1, {ticks: true, labels: false, stroke: '#ffffff', title: { text: 'Proactivo', align: 'center' }});
    this.chart.yAxis(0, {ticks: true, labels: false, stroke: '#ffffff', title: { text: 'Tareas', align: 'center' }});
    this.chart.yAxis(1, {ticks: true, labels: false, stroke: '#ffffff', title: { text: 'Personas', align: 'center' }});


    this.chart.padding(15);

  // creando etiquetas
    


  // configure quarters Background
  this.chart.quarters(
    {
        rightTop: {
            fill: "#fff 0"
        },  
        rightBottom: {
            fill: "#fff 0"
        },
        leftTop: {
            fill: "#fff 0"
        },
        leftBottom: {
            fill: "#fff 0"
        },
    }
    );
      // configure quarters Background
  this.chart.quarters.hovered(
    {
        rightTop: {
            fill: '#111 0.5'
        },   
        rightBottom: {
            fill: "#fff 0"
        },
        leftTop: {
            fill: "#fff 0"
        },
        leftBottom: {
            fill: "#fff 0"
        },
    }
    );

  

  
  }
  ngAfterViewInit(): void {

    this.chart.container(this.container.nativeElement);
    this.chart.draw();
    disabledCredits(this.chart);
 }

}
