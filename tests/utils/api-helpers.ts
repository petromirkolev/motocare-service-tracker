import { API_URL, PASSWORD, msg } from './constants';
import { expect, APIRequestContext, APIResponse } from '@playwright/test';
import { expectApiSuccess } from './response-helpers';
import type { LoginResponse } from '../types/login';

type AddBike = {
  make: string;
  model: string;
  year: number;
};

type AddJob = {};

export async function registerUserApi(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<APIResponse> {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
    },
  });

  return response;
}

export async function loginUserApi(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<APIResponse> {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: {
      email,
      password,
    },
  });

  return response as APIResponse;
}

export async function registerUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<void> {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
    },
  });

  await expectApiSuccess(response, 201, msg.USER_REG_SUCCESS);
}

export async function loginUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<LoginResponse> {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: {
      email,
      password,
    },
  });

  const body = await expectApiSuccess<LoginResponse>(
    response,
    200,
    msg.LOGIN_SUCCESS,
  );

  return body as LoginResponse;
}

export async function addBikeApi(
  request: APIRequestContext,
  user_id: string,
  overrides: Partial<AddBike> = {},
): Promise<APIResponse> {
  const response = await request.post(`${API_URL}/bikes`, {
    data: {
      user_id,
      ...overrides,
    },
  });

  return response;
}

export async function addBike(
  request: APIRequestContext,
  user_id: string,
  overrides: Partial<{
    make: string;
    model: string;
    year: number;
  }> = {},
): Promise<string> {
  const response = await request.post(`${API_URL}/bikes`, {
    data: {
      user_id,
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2021,
      ...overrides,
    },
  });

  const body = await expectApiSuccess<{ bike: { id: string } }>(
    response,
    201,
    msg.BIKE_CREATE_SUCCESS,
  );

  return body.bike.id;
}

export async function listBikesApi(
  request: APIRequestContext,
  user_id: string,
): Promise<any[]> {
  const response = await request.get(`${API_URL}/bikes?user_id=${user_id}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  return body.bikes;
}

export async function deleteBikeApi(
  request: APIRequestContext,
  bike_id: string,
  user_id: string,
): Promise<APIResponse> {
  const response = await request.delete(
    `${API_URL}/bikes/${bike_id}?user_id=${user_id}`,
  );

  return response;
}

export async function addJobApi(
  request: APIRequestContext,
  bike_id?: string,
  user_id?: string,
  overrides: Partial<{
    service_type: 'Oil change' | 'Coolant change';
    odometer: number | string;
    note: 'Change the oil' | 'Change the coolant';
  }> = {},
): Promise<APIResponse> {
  const query = user_id ? `?user_id=${user_id}` : '';

  const response = await request.post(`${API_URL}/jobs${query}`, {
    data: {
      bike_id,
      ...overrides,
    },
  });

  return response;
}

export async function listJobsApi(
  request: APIRequestContext,
  user_id: string,
): Promise<APIResponse> {
  const response = await request.get(`${API_URL}/jobs?user_id=${user_id}`);

  return response;
}

export async function updateJobApi(
  request: APIRequestContext,
  id?: string,
  user_id?: string,
  status?: string,
): Promise<APIResponse> {
  const query = id ? id : '';

  const response = await request.patch(
    `${API_URL}/jobs/${query}/status?user_id=${user_id}`,
    {
      data: {
        status,
      },
    },
  );

  return response;
}
