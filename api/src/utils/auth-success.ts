import { Response } from 'express';
import { LoginResponse, RegisterResponse } from '../types/auth';

export function sendRegisterSuccess(res: Response, message: string): void {
  const body: RegisterResponse = { message };
  res.status(201).json(body);
}

export function sendLoginSuccess(
  res: Response,
  message: string,
  user: { id: string; email: string },
): void {
  const body: LoginResponse = {
    message,
    user,
  };

  res.json(body);
}
