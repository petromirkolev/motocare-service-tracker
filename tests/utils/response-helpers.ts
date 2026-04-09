import { APIResponse, expect } from '@playwright/test';

export async function expectApiSuccess<T = any>(
  response: APIResponse,
  statusCode: number,
  expectedMessage: string,
): Promise<T> {
  expect(response.status()).toBe(statusCode);

  const body = (await response.json()) as T & { message?: string };

  expect(body.message).toBe(expectedMessage);

  return body;
}

export async function expectApiError<T = any>(
  response: APIResponse,
  statusCode: number,
  expectedMessage: string,
): Promise<T> {
  expect(response.status()).toBe(statusCode);

  const body = (await response.json()) as T & { error?: string };

  expect(body.error).toBe(expectedMessage);

  return body;
}
