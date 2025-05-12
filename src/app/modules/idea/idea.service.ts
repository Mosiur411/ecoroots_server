/* eslint-disable @typescript-eslint/no-explicit-any */

import { Idea, IdeaStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import { TIdeaFilterParams, TIdeaPayload } from './idea.types';
import { ideaFilters } from './idea.utilities';
import { JwtPayload } from 'jsonwebtoken';
import { PaginationHelper } from '../../builder/paginationHelper';

export class IdeaServices {
  // draftAnIdeaIntoDB
  static async draftAnIdeaIntoDB(userData: JwtPayload, payload: TIdeaPayload) {
    payload.price = payload.price ? Number(payload.price) : 0;
    payload.authorId = userData.id;
    payload.isPaid = payload.price > 0;

    if (payload.id) {
      // Update a previously created draft (upsert)
      const result = await prisma.idea.upsert({
        where: {
          id: payload.id,
        },
        update: payload,
        create: payload,
      });

      return result;
    } else {
      // Create a draft (no id provided)
      const result = await prisma.idea.create({
        data: payload,
      });

      return result;
    }
  }

  // createAnIdeaIntoDB
  static async createAnIdeaIntoDB(userData: JwtPayload, payload: TIdeaPayload) {
    payload.price = Number(payload.price);
    payload.authorId = userData.id;
    payload.status = IdeaStatus.UNDER_REVIEW;
    payload.isPaid = payload.price > 0;

    // const result = await prisma.idea.upsert({
    //   where: {
    //     id: payload.id,
    //   },
    //   update: payload,
    //   create: payload,
    // });

    // return result;

    if (payload.id) {
      // Update a previously created draft (upsert)
      const result = await prisma.idea.upsert({
        where: {
          id: payload.id,
        },
        update: payload,
        create: payload,
      });

      return result;
    } else {
      // Create a draft (no id provided)
      const result = await prisma.idea.create({
        data: payload,
      });

      return result;
    }
  }

  // getAllIdeasFromDB
  static getAllIdeasFromDB = async (
    params?: TIdeaFilterParams,
    options?: any
  ) => {
    const { limit, page, skip, sortBy, sortOrder } =
      PaginationHelper.calculatePagination(options);

    const filterOptions = ideaFilters(params);

    const result = await prisma.idea.findMany({
      where: { ...filterOptions, status: IdeaStatus.APPROVED },
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      include: {
        votes: true,
        author: true,
        category: true,
        comments: true,
        payments: true,
      },
    });

    const count = await prisma.idea.count({
      where: { ...filterOptions, status: IdeaStatus.APPROVED },
    });

    return {
      meta: {
        page: page,
        limit: limit,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      data: result,
    };
  };

  // get own ideas from DB
  static getOwnAllIdeasFromDB = async (
    params?: TIdeaFilterParams,
    options?: any,
    user?: JwtPayload
  ) => {
    const { limit, page, skip, sortBy, sortOrder } =
      PaginationHelper.calculatePagination(options);
    const filterOptions = ideaFilters(params);

    const whereOptions = { authorId: user?.id, ...filterOptions };

    const result = await prisma.idea.findMany({
      where: whereOptions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      include: {
        votes: true,
        author: true,
        category: true,
        comments: true,
        payments: true,
      },
    });

    const count = await prisma.idea.count({ where: whereOptions });

    return {
      meta: {
        page: page,
        limit: limit,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      data: result,
    };
  };

  // getSingleIdeaFromDB
  static getSingleIdeaFromDB = async (id: string): Promise<Idea | null> => {
   
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        votes: {
          include: {
            user: true, // Only include this if your Vote model has a relation to User
          },
        },
        payments: true,
        comments: {
          where: {
            parentId: null, // Only top-level comments
          },
          include: {
            user: true,
            replies: {
              include: {
                user: true,
                replies: {
                  include: {
                    user: true,
                    replies: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  
    return idea;
  };
  
  // updateIdeaFromDB
  static updateIdeaFromDB = async (
    id: string,
    payload: Partial<Idea>
  ): Promise<Idea | null> => {
    const floatPrice = Number(payload.price);
    payload.price = floatPrice;

    const result = await prisma.idea.update({
      where: {
        id,
        isDeleted: false,
        OR: [{ status: IdeaStatus.DRAFT }, { status: IdeaStatus.UNDER_REVIEW }],
      },
      data: payload,
    });

    return result;
  };

  // deleteAnIdeaFromDB
  static deleteAnIdeaFromDB = async (id: string) => {
    const result = await prisma.idea.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });

    return result;
  };
}
