export interface PagedList<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}