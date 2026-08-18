"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearch = buildSearch;
function buildSearch(search, fields) {
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
