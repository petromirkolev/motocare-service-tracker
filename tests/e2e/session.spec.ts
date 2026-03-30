import { test, expect } from '../fixtures/bikes';

test.describe('Session', () => {
  test('Logged-in user stays logged in after refresh', async ({
    loggedInUser,
    bikesPage,
  }) => {
    await expect(bikesPage.pageBikes).toBeVisible();

    await bikesPage.page.reload();

    await expect(bikesPage.pageBikes).toBeVisible();
  });

  test('Logout returns user to auth page', async ({
    loggedInUser,
    loginPage,
    bikesPage,
  }) => {
    await expect(bikesPage.pageBikes).toBeVisible();

    await bikesPage.logoutButton.click();

    await expect(bikesPage.pageBikes).toBeHidden();

    await expect(loginPage.loginForm).toBeVisible();
  });

  test('Unauthenticated user cannot see app pages on initial load', async ({
    page,
    loginPage,
    bikesPage,
  }) => {
    await page.goto('/');
    await expect(bikesPage.pageBikes).toBeHidden();
    await expect(loginPage.loginForm).toBeVisible();
  });
});
