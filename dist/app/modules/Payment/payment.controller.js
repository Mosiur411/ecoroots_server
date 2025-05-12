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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const httpStatus_1 = require("../../utils/httpStatus");
// create Payment
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.createPaymentIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.CREATED,
        message: 'Payment initiated, pay quickly!',
        data: result,
    });
}));
// get All Payments (admin)
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.getAllPaymentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Payments retrived succesfully!',
        data: result.data,
        meta: result.meta,
    });
});
// getMemberPayments
const getMemberPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.getMemberPaymentsFromDB(req.query, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Payments retrived succesfully!',
        data: result.data,
        meta: result.meta,
    });
}));
// get Payment Details
const getPaymentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.getPaymentDetailsFromDB(req.params.paymentId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Payment retrived succesfully!',
        data: result,
    });
}));
// // change Payment Status
// const changePaymentStatus = catchAsync(async (req: Request, res: Response) => {
//   const { status } = req.body;
//   const result = await PaymentService.changePaymentStatusInDB(
//     req.params.paymentId,
//     status,
//     req.user
//   );
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Payment status changed succesfully!',
//     data: result,
//   });
// });
// validate Payment
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.tran_id;
    const result = yield payment_service_1.paymentService.validatePayment(transactionId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Payment validated succesfully!',
        data: result,
    });
}));
exports.paymentController = {
    createPayment,
    getAllPayments,
    getMemberPayments,
    getPaymentDetails,
    // changePaymentStatus,
    validatePayment,
};
