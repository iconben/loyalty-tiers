
import { HttpResponse } from "@angular/common/http";
import { Pageable } from "./pageable";

export class Page<T> {
  private totalCount: number | null;
  private page: number;
  private size: number;
  private content: T[] | null;

  constructor(res: HttpResponse<T[]>) {
    this.totalCount = res.headers.get('X-Total-Count') != null ? parseInt(res.headers.get('X-Total-Count') as string, 10) : null;
    this.page = res.headers.get('X-Page') != null ? parseInt(res.headers.get('X-Page') as string, 10) : 0;
    this.size = res.headers.get('X-Size') != null ? parseInt(res.headers.get('X-Size') as string, 10) : 0;
    this.content = res.body;
  }

  getTotalCount(): number | null {
    return this.totalCount;
  }

  getPage(): number {
    return this.page;
  }

  getSize(): number {
    return this.size;
  }

  getContent(): T[] | null {
    return this.content;
  }

  getTotalPages(): number {
    return this.totalCount != null ? Math.ceil(this.totalCount / this.size) : 0;
  }

  hasPrevious(): boolean {
    return this.page > 0;
  }

  hasNext(): boolean {
    return this.page < this.getTotalPages() - 1;
  }

  firstPageable(): Pageable {
    return new Pageable(0, this.size);
  }

  previousPageable(): Pageable {
    return this.hasPrevious() ? new Pageable(this.page - 1, this.size) : this.firstPageable();
  }

  nextPageable(): Pageable{
    return this.hasNext() ? new Pageable(this.page + 1, this.size) : this.lastPageable();
  }

  lastPageable(): Pageable {
    return new Pageable(this.getTotalPages() - 1, this.size);
  }
}
