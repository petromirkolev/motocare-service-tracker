import { APIResponse, test as base, expect } from '@playwright/test';
import { uniqueEmail, validInput } from '../utils/test-data';
import {
  addBikeApi,
  loginUserApi,
  registerUserApi,
} from '../utils/api-helpers';
import { LoginResponse } from '../types/login';
import { BikeResponse } from '../types/bike';

type ApiFixtures = {
  registrationResult: {
    email: string;
    password: string;
    response: APIResponse;
  };
  loginResult: {
    email: string;
    password: string;
    response: APIResponse;
    body: LoginResponse;
  };
  validBikeData: {
    make: string;
    model: string;
    year: number;
  };
  validJobData: {
    service_type: 'Oil change' | 'Coolant change';
    odometer: string | number;
    note: 'Change the oil' | 'Change the coolant';
  };
  garageWithOneBike: {
    body: BikeResponse;
  };
};

export const test = base.extend<ApiFixtures>({
  registrationResult: async ({ request }, use) => {
    const email = uniqueEmail();
    const password = validInput.password;

    const response = await registerUserApi(request, email, password);

    await use({ email, password, response });
  },

  loginResult: async ({ request }, use) => {
    const email = uniqueEmail();
    const password = validInput.password;

    await registerUserApi(request, email, password);

    const response = await loginUserApi(request, email, password);

    const body = (await response.json()) as LoginResponse;

    await use({ email, password, response, body });
  },

  garageWithOneBike: async ({ request }, use) => {
    const email = uniqueEmail();
    const password = validInput.password;

    await registerUserApi(request, email, password);

    const loginResponse = await loginUserApi(request, email, password);

    const loginBody = (await loginResponse.json()) as LoginResponse;

    const user_id = loginBody.user.id;

    const bikeResponse = await addBikeApi(request, user_id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2021,
    });

    const body = (await bikeResponse.json()) as BikeResponse;

    await use({ body });
  },

  validBikeData: async ({}, use) => {
    const make = 'Yamaha';
    const model = 'Tracer 9GT';
    const year = 2021;

    await use({ make, model, year });
  },
  validJobData: async ({}, use) => {
    const service_type = 'Oil change';
    const odometer = 1000;
    const note = 'Change the oil';
    await use({ service_type, odometer, note });
  },
});

export { expect };
