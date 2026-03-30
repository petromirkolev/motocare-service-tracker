import { test as base, expect } from '../fixtures/auth';

type BikeFixtures = {
  loggedInUser: {
    email: string;
    password: string;
  };
  seededBike: {
    make: string;
    model: string;
    year: string;
  };
  garageWithOneBike: {
    make: string;
    model: string;
    year: string;
  };
};

export const test = base.extend<BikeFixtures>({
  loggedInUser: async ({ registeredUser, loginPage }, use) => {
    const email = registeredUser.email;
    const password = registeredUser.password;

    await loginPage.goto();

    await expect(loginPage.loginForm).toBeVisible();

    await loginPage.login(registeredUser.email, registeredUser.password);

    await use({ email, password });
  },

  seededBike: async ({}, use) => {
    const suffix = Date.now().toString();

    const seededBike = {
      make: `Test-Make-${suffix}`,
      model: `Test-Model-${suffix}`,
      year: '2021',
    };
    await use(seededBike);
  },

  garageWithOneBike: async ({ loggedInUser, bikesPage, seededBike }, use) => {
    const bike = seededBike;

    await bikesPage.addBike(bike);

    await bikesPage.expectBikeVisible(bike.make);
    await expect(bikesPage.pageBikes).toBeVisible();

    await use(bike);
  },
});

export { expect };
