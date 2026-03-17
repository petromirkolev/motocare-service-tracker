export type AuthUser = {
  id: string;
  email: string;
};

export type RegisterResponse = {
  message: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export type ErrorResponse = {
  error: string;
};
