"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(schema) {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
}
