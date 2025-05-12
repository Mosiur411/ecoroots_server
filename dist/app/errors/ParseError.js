"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class ParseError extends Error {
    constructor(message = "Malformed request.", stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.BAD_REQUEST;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ParseError;
