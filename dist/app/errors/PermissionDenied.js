"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class PermissionDenied extends Error {
    constructor(message = "You do not have permission to perform this action.", stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.FORBIDDEN;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = PermissionDenied;
