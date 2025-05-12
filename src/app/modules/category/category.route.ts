import { Router } from 'express';
import { CategoryController } from './category.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const CategoryRoutes = Router();

CategoryRoutes.post('/', auth(Role.ADMIN), CategoryController.createCategory);

CategoryRoutes.get('/', CategoryController.getAllCategories);

export default CategoryRoutes;
