import { HttpRequest } from '@angular/common/http';

export class Pageable {

    private page: number;

    private size: number;

    private static defaultSize: number = 10;

    constructor(page: number, size: number) {
        this.page = page;
        this.size = size;
        if (this.isPaged()) {
            if (this.size <= 0) {
                this.size = Pageable.defaultSize;
            }
        }
    }

    static getDefaultSize() {
        return Pageable.defaultSize;
    }

    static setDefaultSize(size: number) {
        if (size > 0) {
            Pageable.defaultSize = size;
        }
    }

    isPaged() {
        return this.page >= 0 && this.size > 0;
    }

    getPage() {
        return this.page;
    }

    getSize() {
        return this.size;
    }

    getFullQueryString() {
        if (this.isPaged()) {
            return `page=${this.page}&size=${this.size}`;
        } else {
            return '';
        }
    }
}
