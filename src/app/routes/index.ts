import { Router } from 'express';
import IdeaRoutes from '../modules/idea/idea.route';
import CategoryRoutes from '../modules/category/category.route';
import CommentsRoutes from '../modules/comments/comments.routes';
import { adminRoutes } from '../modules/Admin/admin.route';
import { userRoutes } from '../modules/Users/user.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { paymentRoutes } from '../modules/Payment/payment.routes';
import { voteRoutes } from '../modules/vote/vote.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/ideas',
    route: IdeaRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/comments',
    route: CommentsRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/votes',
    route: voteRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
