export class PaginationParams {

  page: number;
  pageSize: number;
  sortColumn: string;
  sortOrder: string;

  constructor(page: number,
              pageSize: number,
              sortColumn: string,
              sortOrder: string) {

    this.page = page;
    this.pageSize = pageSize;
    this.sortColumn = sortColumn;
    this.sortOrder = sortOrder;
  }
}
