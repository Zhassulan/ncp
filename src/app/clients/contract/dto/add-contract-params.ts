import {ClientContract} from '../model/client-contract';

export class AddContractParams {
  profileId: number;
  contracts: ClientContract [];

  constructor(profileId: number, contracts: ClientContract[]) {
    this.profileId = profileId;
    this.contracts = contracts;
  }
}
