import {Id} from './id';

export class Action extends Id {

    paymentId: number;
    agent: string;
    status: number;
    action: string;
    details: string;
    cdate: string;

}
