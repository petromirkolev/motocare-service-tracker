import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly registerFormButton: Locator;
  readonly registerEmail: Locator;
  readonly registerPassword: Locator;
  readonly registerConfirmPassword: Locator;
  readonly registerButton: Locator;
  readonly registerMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerFormButton = page.getByTestId('tab-register');
    this.registerEmail = page.getByTestId('input-register-email');
    this.registerPassword = page.getByTestId('input-register-password');
    this.registerConfirmPassword = page.getByTestId(
      'input-register-confirm-password',
    );
    this.registerButton = page.getByTestId('btn-register');
    this.registerMessage = page.getByTestId('message-register-error');
  }

  async gotoreg(): Promise<void> {
    await this.page.goto('/');
    await this.registerFormButton.click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.registerEmail.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.registerPassword.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.registerConfirmPassword.fill(password);
  }

  async submit(): Promise<void> {
    await this.registerButton.click();
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.submit();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.registerMessage).toContainText(message);
  }

  async expectSuccess(message: string): Promise<void> {
    await expect(this.registerMessage).toContainText(message);
  }
}
