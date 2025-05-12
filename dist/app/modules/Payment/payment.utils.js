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
exports.sslService = void 0;
/* eslint-disable no-console */
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const httpStatus_1 = require("../../utils/httpStatus");
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const generateTransactionId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomString = Math.random().toString(36).substring(2, 12);
    return `${timestamp}-${randomString}`;
};
const store_id = config_1.default.ssl.store_id;
const store_password = config_1.default.ssl.store_password;
const is_live = false; // true for live, false for sandbox
// SSLCommerz init
const initializaPayment = (total_amount, tran_id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        total_amount,
        currency: 'BDT',
        tran_id, // Use unique tran_id for each API call
        success_url: `${config_1.default.ssl.validation_url}?tran_id=${tran_id}`,
        fail_url: config_1.default.ssl.fail_url,
        cancel_url: config_1.default.ssl.cancel_url,
        ipn_url: 'http://localhost:5000/api/v1/ssl/ipn',
        shipping_method: 'Courier',
        product_name: 'N/A.',
        product_category: 'N/A',
        product_profile: 'general',
        cus_name: 'N/A',
        cus_email: 'N/A',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_password, is_live);
    try {
        const apiResponse = yield sslcz.init(data);
        // Redirect the user to the payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            return GatewayPageURL;
        }
        else {
            throw new AppError_1.default(httpStatus_1.httpStatus.BAD_GATEWAY, 'Failed to generate payment gateway URL!');
        }
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        throw new AppError_1.default(httpStatus_1.httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while processing payment!');
    }
});
// validate Payment
const validatePayment = (tran_id, authUser
//   rental: TRental,
) => __awaiter(void 0, void 0, void 0, function* () {
    const sslcz = new sslcommerz_lts_1.default(store_id, store_password, is_live);
    const validationResponse = yield sslcz.transactionQueryByTransactionId({
        tran_id,
    });
    let data;
    if (validationResponse.element[0].status === 'VALID' ||
        validationResponse.element[0].status === 'VALIDATED') {
        data = {
            status: client_1.PaymentStatus.Paid,
            gatewayResponse: validationResponse.element[0],
        };
    }
    else if (validationResponse.element[0].status === 'INVALID_TRANSACTION') {
        data = {
            status: client_1.PaymentStatus.Failed,
            gatewayResponse: validationResponse.element[0],
        };
    }
    else {
        data = {
            status: client_1.PaymentStatus.Failed,
            gatewayResponse: validationResponse.element[0],
        };
    }
    const updatedPayment = yield prisma_1.default.payment.update({
        where: {
            transactionId: tran_id,
            userEmail: authUser.email,
        },
        data: data,
    });
    if (!updatedPayment) {
        throw new AppError_1.default(httpStatus_1.httpStatus.NOT_MODIFIED, 'Payment not updated!');
    }
    if (data.status === client_1.PaymentStatus.Failed) {
        throw new AppError_1.default(httpStatus_1.httpStatus.EXPECTATION_FAILED, 'Payment failed!');
    }
    // mail sending part
    //   const invoiceData = {
    //     _id: updatedPayment._id,
    //     createdAt: updatedPayment.createdAt as Date,
    //     user: { name: userData.name },
    //     shippingAddress: 'N/A',
    //     paymentStatus: updatedPayment.status,
    //     paymentMethod: updatedPayment.paymentMethod,
    //     products: [
    //       {
    //         product: { name: rental.location },
    //         quantity: 0,
    //         unitPrice: rental.rent,
    //       },
    //     ],
    //     totalAmount: updatedPayment.amount,
    //     discount: 0,
    //     deliveryCharge: 0,
    //     finalAmount: updatedPayment.amount,
    //   };
    //   const pdfBuffer = await generatePaymentInvoicePDF(invoiceData);
    //   const emailContent = await EmailHelper.createEmailContent(
    //     { userName: userData.name || '' },
    //     'orderInvoice',
    //   );
    //   const attachment = {
    //     filename: `Invoice_${updatedPayment._id}.pdf`,
    //     content: pdfBuffer,
    //     encoding: 'base64',
    //   };
    //   await EmailHelper.sendEmail(
    //     userData.email,
    //     emailContent as string,
    //     'Order confirmed-Payment Success!',
    //     attachment,
    //   );
    return updatedPayment;
});
exports.sslService = {
    generateTransactionId,
    initializaPayment,
    validatePayment,
};
