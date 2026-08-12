import { Prisma } from '@prisma/client';

export function buildSearch(
    search: string | undefined,
    fields: string[]
): any {
    const value = search?.trim();

    if (!value) {
        return {};
    }

    return {
        OR: fields.map(field => ({
            [field]: {
                contains: value,
                mode: 'insensitive'
            }
        }))
    };
}