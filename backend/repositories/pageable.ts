export interface Pageable {

    isPaged(): boolean;

    getPage(): number;

    getSize(): number;
}