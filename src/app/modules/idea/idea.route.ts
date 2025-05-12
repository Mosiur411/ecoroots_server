import { NextFunction, Request, Response, Router } from 'express';
import { uploadFile } from '../../utils/cloudinaryImageUploader';
import { IdeaControllers } from './idea.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ideaValidationSchemas } from './idea.validation';

const IdeaRoutes: Router = Router();

IdeaRoutes.post(
  '/draft',
  uploadFile.array('images', 10),
  auth(Role.MEMBER, Role.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ideaValidationSchemas.draftAnIdea),
  IdeaControllers.draftAnIdea
);

IdeaRoutes.post(
  '/',
  uploadFile.array('images', 10),
  auth(Role.MEMBER, Role.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ideaValidationSchemas.createAnIdea),
  IdeaControllers.createAnIdea
);

IdeaRoutes.get(
  '/getOwnIdeas',
  auth(Role.MEMBER),
  IdeaControllers.getOwnAllIdeas
);

IdeaRoutes.get('/', IdeaControllers.getAllIdeas);

IdeaRoutes.get('/:id', IdeaControllers.getSingleIdea);

IdeaRoutes.put(
  '/:id',
  uploadFile.array('images', 10),
  auth(Role.MEMBER, Role.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ideaValidationSchemas.createAnIdea),
  IdeaControllers.updateAIdea
);

IdeaRoutes.delete('/:id', IdeaControllers.deleteAIdea);

export default IdeaRoutes;
