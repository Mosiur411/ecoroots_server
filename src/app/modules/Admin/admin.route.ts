import { Router } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/users', AdminController.getAllUsers);

router.get('/ideas', AdminController.getAllIdeas);

router.patch('/ideas/:id/status', AdminController.updateIdeaStatus);

router.patch(
  '/user/:id/status',
  validateRequest(adminValidationSchemas.userStatusValidation),
  AdminController.updateUserActiveStatus
);

router.delete(
  '/ideas/:id',
  auth(Role.ADMIN),
  AdminController.deleteAnIdeaFromDB
);

export const adminRoutes = router;
