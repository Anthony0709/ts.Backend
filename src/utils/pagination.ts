export interface PaginationQuery {
    page?: number | string;
    limit?: number | string;
}

export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
    take: number;
}

export function getPagination(
    query: PaginationQuery
): PaginationResult {
    const page = Math.max(
        Number(query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(
            Number(query.limit) || 10,
            1
        ),
        100
    );

    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit
    };
}