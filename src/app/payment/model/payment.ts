import {PaymentRegistryItem} from './paymentRegistryItem';
import {ClientProfile} from '../../clients/model/clientProfile';
import {PaymentAction} from '../actions/payment-action';
import {TransitPaymentAction} from '../actions/transit-payment-action';
import {DeferredInfo} from './deferred-info';
import {NcpAction} from '../actions/ncp-action';

export class Payment {
  id: number;
  profileId: number;
  paymentId: number;
  docnum: string;
  user: string;
  status: number;
  created: string;
  distributed: string;
  sum: number;
  sender: string;
  bin: string;
  accountSender: string;
  accountRecipient: string;
  knp: string;
  mobipayPartner: string;
  details: string;
  transitPaymentDocNumId: number;
  mobipay: boolean;
  hidden: boolean;
  auto: boolean;
  statusRu: string;
  registry: PaymentRegistryItem [];
  paymentActions: PaymentAction [];
  deferredPaymentInfoEntities: DeferredInfo [];
  actions: NcpAction [];
  transitActions: TransitPaymentAction [];
  clientProfile: ClientProfile;
}
