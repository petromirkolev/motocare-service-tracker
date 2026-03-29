import { registerUser } from '../utils/api-helpers';
import { uniqueEmail, validInput } from '../utils/test-data';
import { test as base, expect } from './base';

type AuthFixtures = {
  registrationData: {
    email: string;
    password: string;
  };

  registeredUser: {
    email: string;
    password: string;
  };
};

export const test = base.extend<AuthFixtures>({
  registrationData: async ({}, use) => {
    const email = uniqueEmail();
    const password = validInput.password;

    await use({ email, password });
  },

  registeredUser: async ({ request, registrationData }, use) => {
    await registerUser(
      request,
      registrationData.email,
      registrationData.password,
    );

    await use(registrationData);
  },
});

export { expect, validInput, uniqueEmail };
