import {
  test,
  uniqueEmail,
  registerUserApi,
  loginUserApi,
} from '../fixtures/api';
import { msg } from '../utils/constants';
import { expectApiError, expectApiSuccess } from '../utils/response-helpers';

test.describe('MST - Auth API', () => {
  test('Register with valid credentials returns 201', async ({
    registrationResult,
  }) => {
    await expectApiSuccess(
      registrationResult.response,
      201,
      msg.USER_REG_SUCCESS,
    );
  });

  test('Register with duplicate email returns 409', async ({
    registrationResult,
    request,
  }) => {
    const duplicateResponse = await registerUserApi(
      request,
      registrationResult.email,
    );

    await expectApiError(duplicateResponse, 409, msg.USER_EXISTS);
  });

  test('Register with invalid email returns 400', async ({ request }) => {
    const response = await registerUserApi(request, '##@abv.bg');

    await expectApiError(response, 400, msg.EMAIL_INVALID);
  });

  test('Register with missing email returns 400', async ({ request }) => {
    const response = await registerUserApi(request, '');

    await expectApiError(response, 400, msg.EMAIL_PASSWORD_REQUIRED);
  });

  test('Register with missing password returns 400', async ({ request }) => {
    const response = await registerUserApi(request, uniqueEmail(), '');

    await expectApiError(response, 400, msg.EMAIL_PASSWORD_REQUIRED);
  });

  test('Register with short password returns 400', async ({ request }) => {
    const response = await registerUserApi(request, uniqueEmail(), 'test');

    await expectApiError(response, 400, msg.PASSWORD_MIN_LENGTH);
  });

  test('Register with long password returns 400', async ({ request }) => {
    const response = await registerUserApi(
      request,
      uniqueEmail(),
      'testingthesuperlongpasswordtwotimestestingthesuperlongpasswordtwotimes',
    );

    await expectApiError(response, 400, msg.PASSWORD_MAX_LENGTH);
  });

  test('Login with valid credentials returns 200', async ({ loginResult }) => {
    await expectApiSuccess(loginResult.response, 200, msg.LOGIN_SUCCESS);
  });

  test('Login with wrong password returns 401', async ({
    registrationResult,
    request,
  }) => {
    const loginResponse = await loginUserApi(
      request,
      registrationResult.email,
      'testingpass1',
    );

    await expectApiError(loginResponse, 401, msg.INVALID_CREDENTIALS);
  });

  test('Login with non existing email returns 401', async ({ request }) => {
    const loginResponse = await loginUserApi(request, uniqueEmail());

    await expectApiError(loginResponse, 401, msg.INVALID_CREDENTIALS);
  });

  test('Login with missing email returns 400', async ({ request }) => {
    const loginResponse = await loginUserApi(request, '');

    await expectApiError(loginResponse, 400, msg.EMAIL_PASSWORD_REQUIRED);
  });

  test('Login with missing password returns 400', async ({ request }) => {
    const loginResponse = await loginUserApi(request, uniqueEmail(), '');

    await expectApiError(loginResponse, 400, msg.EMAIL_PASSWORD_REQUIRED);
  });
});
