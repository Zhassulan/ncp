import {Title} from '@angular/platform-browser';
import {Component, inject, ViewEncapsulation} from '@angular/core';
import {MenuToolbarComponent} from './navbar/menu-toolbar.component';
import {SpinnerComponent} from './spinner/spinner/spinner.component';
import {SpinnerService} from './spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [MenuToolbarComponent, SpinnerComponent]
})
export class AppComponent {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displaySpinner = false;

  readonly titleService = inject(Title);
  readonly spinnerService = inject(SpinnerService);

  constructor() {
    this.spinnerService.spinnerCommandAnnounced$.subscribe(value => {
      this.displaySpinner = value;
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
