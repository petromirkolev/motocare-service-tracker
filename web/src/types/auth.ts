/* This file defines TypeScript types related to authentication, including user information and response formats for login and registration. */

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthSuccessUser = {
  id: string;
  email: string;
};

export type LoginResponse = {
  message: string;
  user: AuthSuccessUser;
};

export type RegisterResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
