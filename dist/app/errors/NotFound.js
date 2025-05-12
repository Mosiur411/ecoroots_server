"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class NotFound extends Error {
    constructor(message = "Not found.", stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.NOT_FOUND;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = NotFound;
