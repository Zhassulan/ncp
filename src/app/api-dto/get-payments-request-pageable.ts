import {PageableRequest} from '../clients/pageable-request';

export class GetPaymentsRequestPageable extends PageableRequest {

  startDate: Date;
  endDate: Date;
  searchValue: string;
  profileId: number;
  hidden: boolean;
  status: number;

  constructor(startDate: Date, endDate: Date, searchValue: string, profileId: number, hidden: boolean, status: number,
              pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string) {

    super(pageIndex, pageSize, sortColumn, sortOrder);

    this.startDate = startDate;
    this.endDate = endDate;
    this.searchValue = searchValue;
    this.profileId = profileId;
    this.hidden = hidden;
    this.status = status;
  }
}
