export class PaymentProcessingMessage {
  user: string;
  paymentId: number;
  status: number;
  nameSender: string;
  rnnSender: string;
  message: string;
}
