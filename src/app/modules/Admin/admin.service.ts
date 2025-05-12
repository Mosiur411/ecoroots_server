import { Idea, IdeaStatus, Prisma } from '@prisma/client';
import { PaginationHelper } from '../../builder/paginationHelper';
import prisma from '../../config/prisma';
import { ConditionsBuilder } from '../../builder/conditionsBuilder';
import { ideaFields, userFields } from './admin.constant';

// getAllUsersFromDB
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.UserWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, userFields);

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {votes:true,payments:true,comments: true,ideas: true}
  });

  const count = await prisma.user.count({
    where: whereConditions,
  });

  // const result = await prisma.user.findMany({
  //   where: {
  //     isActive: true,
  //   },
  //   skip,
  //   take: limit,
  //   orderBy: { [sortBy]: sortOrder },
  // });

  // const count = await prisma.user.count({
  //   where: {
  //     isActive: true,
  //   },
  // });

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

// getAllIdeasFromDB
const getAllIdeasFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.IdeaWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, ideaFields);

  // Dynamic status filter
  let statusFilter: Prisma.IdeaWhereInput;
  if (query?.status) {
    statusFilter = {
      status: query.status as IdeaStatus, // single status filter
    };
  } else {
    statusFilter = {
      status: {
        in: [IdeaStatus.UNDER_REVIEW, IdeaStatus.APPROVED, IdeaStatus.REJECTED],
      },
    };
  }

  const whereConditions: Prisma.IdeaWhereInput =
    andConditions.length > 0
      ? {
          AND: [...andConditions, statusFilter],
        }
      : statusFilter;

  const result = await prisma.idea.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      author: true,
    },
  });

  const count = await prisma.idea.count({
    where: whereConditions,
  });

  // const result = await prisma.idea.findMany({
  //   where: {
  //     status: {
  //   in: [IdeaStatus.UNDER_REVIEW, IdeaStatus.APPROVED],
  // },
  //   },
  //   skip,
  //   take: limit,
  //   orderBy:
  //     sortBy && sortOrder
  //       ? {
  //           [sortBy]: sortOrder,
  //         }
  //       : {
  //           createdAt: 'desc',
  //         },
  // });

  // const count = await prisma.idea.count({
  //   where: {
  //     status: {
  //       in: [IdeaStatus.UNDER_REVIEW, IdeaStatus.APPROVED],
  //     },
  //   },
  // });

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

// updateIdeaStatusIntoDB
const updateIdeaStatusIntoDB = async (id: string, status: Partial<Idea>) => {
  const result = await prisma.idea.update({
    where: {
      id,
      isDeleted: false,
    },
    data: { ...status },
  });
  return result;
};
// updateUserActiveStatus
const updateUserActiveStatus = async (
  id: string,
  status: { isActive: boolean }
) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: { isActive: status.isActive || false },
  });
  return result;
};

  // deleteAnIdeaFromDB
  const deleteAnIdeaFromDB = async (id: string) => {
    const result = await prisma.idea.update({
      where: { id, isDeleted: false }, 
      data: { isDeleted: true },
    });

    return result;
  };

export const AdminService = {
  getAllUsersFromDB,
  getAllIdeasFromDB,
  updateIdeaStatusIntoDB,
  updateUserActiveStatus,
  deleteAnIdeaFromDB
};
