import type { UserCredentials } from '@typedefs/index';

export const validCredentials: UserCredentials = {
  username: 'Admin',
  password: 'admin123',
};

export const invalidCredentials: UserCredentials = {
  username: 'wrong',
  password: 'wrong',
};

export const wrongUsername: UserCredentials = {
  username: 'wrong',
  password: 'admin123',
};

export const wrongPassword: UserCredentials = {
  username: 'Admin',
  password: 'wrong',
};
