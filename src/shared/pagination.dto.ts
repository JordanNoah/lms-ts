export default class PaginationDto {
    constructor(
        public itemsPerPage: number = 10,
        public page: number = 1,
        public sorting: Sorting | undefined | null,
        public search?: string | null
    ) {
        if (this.sorting && !['ASC', 'DESC'].includes(this.sorting.order)) {
            this.sorting.order = 'ASC';
        }
    }
}

interface Sorting {
    key: string,
    order: 'ASC' | 'DESC'
}