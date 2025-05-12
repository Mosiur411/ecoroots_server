"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = require("./httpStatus");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(httpStatus_1.httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route is not found! Please try again!',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found!',
        },
    });
});
exports.default = notFound;
