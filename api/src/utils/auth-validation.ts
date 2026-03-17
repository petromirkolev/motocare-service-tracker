import { AuthBody } from '../types/auth-body';

export function getValidatedAuthBody(body: AuthBody): {
  email: string;
  password: string;
} | null {
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return null;
  }

  return { email, password };
}
