import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { httpStatus } from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import { commentService } from './comments.service';

const createComments = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You must be logged in to comment!'
    );
  }

  const result = await commentService.createCommentsIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Comment added successfully!',
    data: result,
  });
});

const getCommentsByIdeaId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await commentService.getCommentByIdeaIdFromDB(id);

  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You must be logged in to view comments!'
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Comment list retrieved successfully!',
    // meta: result?.meta,
    data: result,
  });
});

const deleteComments = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await commentService.deleteCommentFromDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Comment deleted successfully!',
    data: result,
  });
});

export const commentController = {
  createComments,
  getCommentsByIdeaId,
  deleteComments,
};
