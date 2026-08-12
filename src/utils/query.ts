export interface QueryOptions {
    page?: number | string;
    limit?: number | string;
    search?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

export interface QueryResult {
    page: number;
    limit: number;
    search: string;
    skip: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc'>;
}

export function buildQuery(
    query: QueryOptions = {}
): QueryResult {
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

    const search =
        typeof query.search === 'string'
            ? query.search.trim()
            : '';

    const orderBy =
        query.orderBy?.trim() || 'createdAt';

    const order =
        query.order === 'asc'
            ? 'asc'
            : 'desc';

    return {
        page,
        limit,
        search,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            [orderBy]: order
        }
    };
}