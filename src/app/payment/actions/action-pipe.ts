import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'paymentActionsPipe' })
export class ActionPipe implements PipeTransform {

  transform(action: string): string {

    if (action == null) {
      return '';
    }

    if (action.includes('distribution')) {
      return 'Разнесения платежа';
    }
    if (action.includes('auto')) {
      return 'Автоматическое разнесения платежа';
    }
    if (action.includes('transit') && !action.includes('delete_transit')) {
      return 'Перевод на транзитный счет';
    }
    if (action.includes('delete_transit')) {
      return 'Удаление с транзитного счета';
    }
    if (action.includes('transit_payment')) {
      return 'Создание транзитного платежа';
    }
    if (action.includes('transit_payment')) {
      return 'Создание транзитного платежа';
    }
    if (action.includes('defer')) {
      return 'Разнесение платежа отложено на дату';
    }
    if (action.includes('defer')) {
      return 'Разнесения платежа отложено на дату';
    }
    if (action.includes('mobipay_change')) {
      return 'Перенос в/из Mobipay';
    }
    if (action.includes('mobipay_distribution')) {
      return 'Разнесение Mobipay платежа';
    }
    if (action.includes('scheduled')) {
      return 'Запланирован';
    }
    return action;
  }
}
