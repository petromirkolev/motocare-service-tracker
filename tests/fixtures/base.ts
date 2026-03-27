import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { JobsPage } from '../pages/jobs-page';
import { BikesPage } from '../pages/bikes-page';

type BaseFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  bikesPage: BikesPage;
  jobsPage: JobsPage;
};

export const test = base.extend<BaseFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  bikesPage: async ({ page }, use) => {
    await use(new BikesPage(page));
  },
  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page));
  },
});

export { expect };
