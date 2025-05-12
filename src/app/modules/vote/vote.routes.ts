import { voteController } from './vote.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  deleteVoteValidationSchema,
  getVoteStatsValidationSchema,
  voteValidationSchema,
} from './vote.validation';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN, Role.MEMBER),
  validateRequest(voteValidationSchema),
  voteController.createOrUpdateVote
);

router.delete(
  '/:ideaId',
  auth(Role.ADMIN, Role.MEMBER),
  validateRequest(deleteVoteValidationSchema),
  voteController.removeVote
);

router.get(
  '/stats/:ideaId',
  validateRequest(getVoteStatsValidationSchema),
  voteController.getVoteStats
);

router.get(
  '/:ideaId',
  auth(Role.ADMIN, Role.MEMBER),
  validateRequest(getVoteStatsValidationSchema),
  voteController.getUserVote
);

router.get('/ideas/by-votes', voteController.getAllIdeasByVotes);

export const voteRoutes = router;
