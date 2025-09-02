export class PaymentDto {
  id: number;
  profileId: number;
  agent: string;
  status: number;
  creationDate: string;
  sum: number;
  statementReference: string;
  nameSender: string;
  rnnSender: string;
  accountSender: string;
  paymentId: number;
  paymentDocnum: string;
  distributedDate: string;
  knp: string;
  loadDate: string;
  companyId: number;
  mobipayPartner: string;
  details: string;
  closeDate: string;
  accountRecipient: string;
  scheduledTime: string;
  executedTime: string;
  transitPaymentDocNumId: number;
  isMobipay: boolean;
}
