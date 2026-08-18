"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = getParam;
function getParam(req, name) {
    const value = req.params[name];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
