import {Component, DoCheck, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';
import {OverlayRef} from '@angular/cdk/overlay';
import {SpinnerService} from '../spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, DoCheck {

  @Input() color?: ThemePalette;
  @Input() mode?: 'indeterminate';
  @Input() value?: number;
  @Input() displayProgressSpinner: boolean;

  @ViewChild('progressSpinnerRef')
  private progressSpinnerRef: TemplateRef<any>;
  private progressSpinnerOverlayConfig;
  private overlayRef: OverlayRef;

  constructor(private vcRef: ViewContainerRef,
              private spinnerService: SpinnerService) {
  }

  ngDoCheck(): void {
    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
      this.spinnerService.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
    } else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnInit(): void {
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: true
    };
    this.progressSpinnerOverlayConfig['positionStrategy'] = this.spinnerService.positionGloballyCenter();
    // Create Overlay for progress spinner
    this.overlayRef = this.spinnerService.createOverlay(this.progressSpinnerOverlayConfig);
  }
}
