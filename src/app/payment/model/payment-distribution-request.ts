import {PaymentRegistryItemRequest} from './payment-registry-item-request';

export class PaymentDistributionRequest {

  id: number;
  registry: PaymentRegistryItemRequest [];
  user: string = null;

  constructor(id: number, registry: PaymentRegistryItemRequest[]) {
    this.id = id;
    this.registry = registry;
  }
}
