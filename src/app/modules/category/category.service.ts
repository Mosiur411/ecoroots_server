import { Category, Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { PaginationHelper } from '../../builder/paginationHelper';
import { ConditionsBuilder } from '../../builder/conditionsBuilder';
import { CategoryFields } from './category.constants';
import AppError from '../../errors/AppError';
import { httpStatus } from '../../utils/httpStatus';

// createCategoryIntoDB
const createCategoryIntoDB = async (payload: Partial<Category>) => {
  if (!payload.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Must give a name for the Title")

  }
    const result = await prisma.category.create({
      data: {
        name: payload.name,
      },
    });

  return result;
};

// getAllCategoriesFromDB
const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.CategoryWhereInput[] = [];

  andConditions = ConditionsBuilder.prisma(
    query,
    andConditions,
    CategoryFields
  );

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: {
      ...whereConditions,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const count = await prisma.category.count({
    where: {
      ...whereConditions,
    },
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

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
