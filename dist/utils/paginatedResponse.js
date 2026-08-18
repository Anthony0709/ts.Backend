"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = paginatedResponse;
function paginatedResponse(data, total, page, limit) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.max(Number(limit) || 10, 1);
    return {
        data,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
    };
}
