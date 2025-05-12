"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class NotAuthenticated extends Error {
    constructor(message = "Authentication credentials were not provided.", stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.UNAUTHORIZED;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = NotAuthenticated;
