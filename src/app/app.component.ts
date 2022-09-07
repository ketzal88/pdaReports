import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../node_modules/anychart/dist/css/anychart-ui.min.css',
    '../../node_modules/anychart/dist/fonts/css/anychart-font.min.css']
})
export class AppComponent {
  title = 'PDA';
}
