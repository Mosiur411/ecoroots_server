import prisma from '../../config/prisma';
import bcrypt from 'bcrypt';
import { IUser } from './user.interface';
import { Role, User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { generateToken } from '../../utils/jwtHelper';
import { defaultUserImage } from '../../constants/global.constants';

// createUserIntoDB
const createUserIntoDB = async (payload: IUser) => {
  const hashPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );
  const userData = {
    ...payload,
    role: Role.MEMBER,
    password: hashPassword,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

// changeUserStatus
const changeUserStatus = async (
  userId: string,
  payload: { isActive: boolean; role: Role }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: payload,
  });
  return result;
};

const getMyProfile = async (user: JwtPayload) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      isActive: true,
    },
  });
  let profileInfo;
  if (userData.role === Role.ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userData.email,
        role: Role.ADMIN,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  } else if (userData.role === Role.MEMBER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userData.email,
        role: Role.MEMBER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }
  return profileInfo;
};

const getSingleUserFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updateProfile = async (
  id: string,
  payload: Partial<IUser>
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await prisma.user.update({
    where: { id, isActive: true },
    data: payload,
  });

  const accessToken = generateToken(
    {
      email: user.email,
      role: user.role,
      image: user?.image || defaultUserImage,
      name: user.name,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiration as string
  );

  const refreshToken = generateToken(
    {
      email: user.email,
      role: user.role,
      image: user?.image || defaultUserImage,
      name: user.name,
    },
    config.jwt.refresh_secret as string,
    config.jwt.jwt_refresh_expiration as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const userServices = {
  createUserIntoDB,
  changeUserStatus,
  getMyProfile,
  getSingleUserFromDB,
  updateProfile,
};
