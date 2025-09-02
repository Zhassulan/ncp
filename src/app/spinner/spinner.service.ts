import {Injectable, TemplateRef, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayRef, PositionStrategy} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerCommandAnnouncement = new Subject<boolean>();
  public spinnerCommandAnnounced$ = this.spinnerCommandAnnouncement.asObservable();

  constructor(
    private overlay: Overlay
  ) {
  }

  start() {
    this.announceSpinnerCommand(true);
  }

  stop() {
    this.announceSpinnerCommand(false);
  }

  announceSpinnerCommand(value) {
    this.spinnerCommandAnnouncement.next(value);
  }

  createOverlay(config): OverlayRef {
    return this.overlay.create(config);
  }

  attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<any>, vcRef: ViewContainerRef) {
    const templatePortal = new TemplatePortal(templateRef, vcRef);
    overlayRef.attach(templatePortal);
  }

  positionGloballyCenter(): PositionStrategy {
    return this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
  }
}
