import { Router } from 'express';
import { commentController } from './comments.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const CommentsRoutes = Router();

CommentsRoutes.post(
  '/',
  auth(Role.MEMBER, Role.ADMIN),
  commentController.createComments
);

CommentsRoutes.get(
  '/:id',
  auth(Role.MEMBER, Role.ADMIN),
  commentController.getCommentsByIdeaId
);

CommentsRoutes.delete(
  '/:id',
  auth(Role.ADMIN, Role.MEMBER),
  commentController.deleteComments
);

export default CommentsRoutes;
