import { sslService } from './payment.utils';
import { JwtPayload } from 'jsonwebtoken';
import { TPayment } from './payment.interface';
// import { generatePaymentInvoicePDF } from '../../utils/generatePaymentInvoicePDF';
// import { EmailHelper } from '../../utils/emailHelper';
import AppError from '../../errors/AppError';
import { httpStatus } from '../../utils/httpStatus';
import prisma from '../../config/prisma';
import { PaginationHelper } from '../../builder/paginationHelper';
import { PaymentStatus, Prisma } from '@prisma/client';
import { ConditionsBuilder } from '../../builder/conditionsBuilder';
import { paymentFields } from './payment.constants';

// create Payment
const createPaymentIntoDB = async (
  paymentData: TPayment,
  authUser: JwtPayload
) => {
  const idea = await prisma.idea.findUnique({
    where: {
      id: paymentData.ideaId,
      isDeleted: false,
    },
  });
  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not Found!');
  }
  const transactionId = sslService.generateTransactionId();

  paymentData.userEmail = authUser.email;
  paymentData.amount = idea.price!;
  paymentData.status = PaymentStatus.Pending;
  paymentData.transactionId = transactionId;

  // create the Payment
  const createdPayment = await prisma.payment.create({
    data: paymentData,
  });

  // initializaPayment
  const paymentUrl = await sslService.initializaPayment(
    createdPayment.amount,
    transactionId
  );

  return paymentUrl;
};

// get All Payments
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.PaymentWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, paymentFields);

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const count = await prisma.payment.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// getMemberPaymentsFromDB
const getMemberPaymentsFromDB = async (
  query: Record<string, unknown>,
  authUser: JwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.PaymentWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, paymentFields);

  andConditions.push({
    userEmail: authUser.email,
  });

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const count = await prisma.payment.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// getPaymentDetailsFromDB
const getPaymentDetailsFromDB = async (
  paymentId: string,
  authUser: JwtPayload
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
      userEmail: authUser.email,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not Found!');
  }

  return payment;
};

// // changePaymentStatusInDB
// const changePaymentStatusInDB = async (
//   paymentId: string,
//   status: string,
//   authUser: JwtPayload
// ) => {
//   const payment = await prisma.payment.findUnique({
//     where: {
//       id: paymentId,
//       userEmail: authUser.email,
//     },
//   });
//   if (!payment) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Payment not Found!');
//   }

//   const result = await prisma.payment.update({
//     where: { id: paymentId },
//     data: { status: status as PaymentStatus },
//   });

//   return result;
// };

// validate Payment
const validatePayment = async (transactionId: string, authUser: JwtPayload) => {
  // this user will be exists as he/she passed the auth() middleware
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
      userEmail: authUser.email,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not Found!');
  }

  const result = await sslService.validatePayment(transactionId, authUser);

  return result;
};

export const paymentService = {
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getMemberPaymentsFromDB,
  getPaymentDetailsFromDB,
  // changePaymentStatusInDB,
  validatePayment,
};
