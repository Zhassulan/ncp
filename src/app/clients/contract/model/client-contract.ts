export class ClientContract {
  id: number;
  bercutClientId: number;
  bin: string;
  payAccount: string;
  bik: string;
  contractNum: string;
  profileId: string;
  managedBy: string;

  constructor(bercutClientId: number, bin: string, payAccount: string, bik: string, contractNum: string, profileId: string) {
    this.bercutClientId = bercutClientId;
    this.bin = bin;
    this.payAccount = payAccount;
    this.bik = bik;
    this.contractNum = contractNum;
    this.profileId = profileId;
  }
}
