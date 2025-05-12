import { authControllers } from './auth.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { Router } from 'express';

const router = Router();

router.post('/login', authControllers.loginUser);

router.post('/refresh-token', authControllers.refreshToken);

router.patch(
  '/change-password',
  auth(Role.ADMIN, Role.MEMBER),
  authControllers.changePassword
);

router.post('/forget-password', authControllers.forgetPassword);

router.post('/reset-password', authControllers.resetPassword);

export const authRoutes = router;
