import {Component, effect, EventEmitter, input, Output} from '@angular/core';
import {PaymentService} from '../payment.service';
import {PaymentMenuItems} from '../../settings';
import {AuthService} from '../../auth/auth.service';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {Payment} from '../model/payment';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-payment-menu',
  templateUrl: './payment-menu.component.html',
  styleUrls: ['./payment-menu.component.scss'],
  imports: [MatIconButton, MatTooltip, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, NgIf]
})
export class PaymentMenuComponent {

  paymentMenuItems = PaymentMenuItems;
  @Output() selectedMenuItem = new EventEmitter<number>();
  payment = input<Payment>();

  constructor(private paymentService: PaymentService,
              private authService: AuthService) {

    effect(() => {
      console.log('Payment menu component: payment updated');
      console.log(this.payment());
    });
  }

  select(item: number) {
    this.selectedMenuItem.emit(item);
  }

  canPasteRegistryFromBuffer() {
    return this.paymentService.canPasteRegistryFromBuffer(this.payment());
  }

  canLoadEquipment() {
    return this.paymentService.canLoadEquipment(this.payment());
  }

  canTransit() {
    return this.paymentService.canTransit(this.payment());
  }

  canDelTransit() {
    return this.paymentService.canDelTransit(this.payment());
  }

  canDefer() {
    return this.paymentService.canDefer(this.payment());
  }

  canDistribute() {
    return this.paymentService.canDistribute(this.payment());
  }

  canDistributeMobipay() {
    return this.paymentService.canDistributeMobipay(this.payment());
  }

  canDel() {
    return this.paymentService.canDel(this.payment()) && this.authService.hasDeletePaymentRole() && !this.payment().mobipay;
  }

  canDelFromDeferred() {
    return this.paymentService.canDelFromDeferred(this.payment());
  }

  canEditPayment() {
    const b = this.authService.hasEditPaymentRole() && !this.authService.hasReadOnlyRole();
    if (!b) {
      console.log('Payment menu: You haven`t role for edit payment');
    }
    return b;
  }

  canCancelMobipay() {
    return this.paymentService.canCancelMobipay(this.payment());
  }

  canExportRegistry() {
    return this.paymentService.canExportRegistry(this.payment());
  }
}
