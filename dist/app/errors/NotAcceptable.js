"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class NotAcceptable extends Error {
    constructor(message = "Could not satisfy the request Accept header.", stack = "") {
        super(message);
        this.statusCode = httpStatus_1.httpStatus.NOT_ACCEPTABLE;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = NotAcceptable;
