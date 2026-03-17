/* DOM selectors for the application. These are used to access and manipulate specific elements in the DOM throughout the app. */

export const dom = {
  /* Initial screen */
  initialScreen: document.querySelector<HTMLElement>(
    '[data-testid="page-auth"]',
  ),
  loginButton: document.querySelector<HTMLButtonElement>(
    '[data-testid="tab-login"]',
  ),
  registerButton: document.querySelector<HTMLButtonElement>(
    '[data-testid="tab-register"]',
  ),

  /* Login screen */
  loginForm: document.querySelector<HTMLFormElement>(
    '[data-testid="form-login"]',
  ),
  loginHint: document.querySelector<HTMLElement>(
    '[data-testid="message-login-error"]',
  ),

  /* Register screen */
  registerForm: document.querySelector<HTMLFormElement>(
    '[data-testid="form-register"]',
  ),
  registerHint: document.querySelector<HTMLElement>(
    '[data-testid="message-register-error"]',
  ),

  /* Bikes screen */
  bikeScreen: document.querySelector<HTMLFormElement>(
    '[data-testid="page-bikes"]',
  ),
};
