import { Role } from '@prisma/client';

export type IUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: Role;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
