import {PageableRequest} from './pageable-request';

export class GetClientRequest extends PageableRequest {

  bin: string;
  name: string;
  mobipay: boolean;

  constructor(bin: string, name: string, mobipay: boolean, pageIndex: number, pageSize: number, sortColumn: string,
              sortOrder: string) {

    super(pageIndex, pageSize, sortColumn, sortOrder);

    this.bin = bin;
    this.name = name;
    this.mobipay = mobipay;
  }
}
