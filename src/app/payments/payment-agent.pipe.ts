import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paymentAgentPipe' })
export class PaymentAgentPipe implements PipeTransform {

  transform(agent: string): string {
    return agent != null ? agent.replace('.', '. ')
      .replace(';MB', ' ;MB') : agent;
  }

}
