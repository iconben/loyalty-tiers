import { Request } from 'express';
import { Pageable } from '../repositories/pageable';

export class PageableImp implements Pageable {

    private _page: number;

    private _size: number;

    private static _defaultSize: number = 10;

    constructor(req: Request) {
        this._page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
        this._size = req.query.size ? parseInt(req.query.size as string, 10) : 0;
        if (this.isPaged()) {
            if (this._size <= 0) {
                this._size = PageableImp._defaultSize;
            }
        }
    }

    static getDefaultSize() {
        return PageableImp._defaultSize;
    }

    static setDefaultSize(size: number) {
        if (size > 0) {
            PageableImp._defaultSize = size;
        }
    }

    isPaged() {
        return this._page >= 0 && this._size > 0;
    }

    getPage() {
        return this._page;
    }

    getSize() {
        return this._size;
    }
}