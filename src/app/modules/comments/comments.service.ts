import { Comment, Role } from '@prisma/client';
import prisma from '../../config/prisma';
import AppError from '../../errors/AppError';
import { httpStatus } from '../../utils/httpStatus';
import { JwtPayload } from 'jsonwebtoken';

const createCommentsIntoDB = async (
  payload: Partial<Comment>,
  user: JwtPayload
) => {
  if (!payload.ideaId || !payload.content) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Required fields missing');
  }
  const filterData = {
    content: payload.content,
    ideaId: payload.ideaId,
    userId: user.id,
    parentId: payload.parentId || null,
  };
  const result = await prisma.comment.create({
    data: filterData,
    include: {
      user: { select: { name: true } },
    },
  });

  return result;
};

const getCommentByIdeaIdFromDB = async (ideaId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      ideaId: ideaId,
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
  });
  return comments;
};

const deleteCommentFromDB = async (id: string, authUser: JwtPayload) => {
  const userId = authUser.id;

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (authUser.role !== Role.ADMIN) {
    if (comment.userId !== userId) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Not premited to delete other's comment!"
      );
    }
  }

  const deletedComment = await prisma.comment.delete({
    where: { id },
  });

  return deletedComment;
};

export const commentService = {
  createCommentsIntoDB,
  getCommentByIdeaIdFromDB,
  deleteCommentFromDB,
};
