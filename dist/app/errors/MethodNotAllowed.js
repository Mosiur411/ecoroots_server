"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class MethodNotAllowed extends Error {
    constructor(message = `Method not allowed.`, stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.METHOD_NOT_ALLOWED;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = MethodNotAllowed;
