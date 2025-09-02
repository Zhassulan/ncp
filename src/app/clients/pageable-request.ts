export class PageableRequest {

  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortOrder: string;

  constructor(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortColumn = sortColumn;
    this.sortOrder = sortOrder;
  }
}
