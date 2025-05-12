"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("../utils/httpStatus");
class AuthenticationFailed extends Error {
    constructor(message = "Incorrect authentication credentials.", stack = "") {
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
exports.default = AuthenticationFailed;
