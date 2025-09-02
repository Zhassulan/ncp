export class TemplateDetail {

    id: number;
    msisdn: string;
    account: number;
    sum: number;

    constructor(msisdn: string, account: number, sum: number) {
        this.msisdn = msisdn;
        this.account = account;
        this.sum = sum;
    }

}
