import { Pageable } from "./pageable";

export class Page<T> {
    private _page: number;
    private _size: number;
    private _content: T[];
    private _totalCount: number;

    constructor(pageable: Pageable, content: T[], totalCount: number) {
        this._page = pageable.getPage();
        this._size = pageable.getSize();
        this._content = content;
        this._totalCount = totalCount;
    }

    getPage(): number {
        return this._page;
    }

    getSize(): number {
        return this._size;
    }

    getContent(): T[] {
        return this._content;
    }

    getTotalCount(): number {
        return this._totalCount;
    }
}