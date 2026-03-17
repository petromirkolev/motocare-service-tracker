import { dom } from './selectors';
import { showScreen, showAuthForm } from '../ui/show-screen';

export const render = {
  initialScreen(): void {
    showScreen('auth');
    showAuthForm('login');
    this.errorMessage('', 'login');
    this.errorMessage('', 'register');
  },

  loginScreen(): void {
    showScreen('auth');
    showAuthForm('login');
    this.errorMessage('', 'login');
  },

  registerScreen(): void {
    showScreen('auth');
    showAuthForm('register');
    this.errorMessage('', 'register');
  },

  bikeScreen(): void {
    showScreen('bikes');
  },

  errorMessage(
    message: string = '',
    target: 'login' | 'register' | 'logout' = 'login',
  ) {
    switch (target) {
      case 'login':
        if (dom.loginHint) dom.loginHint.textContent = message;
        break;
      case 'register':
        if (dom.registerHint) dom.registerHint.textContent = message;
        break;
      default:
        break;
    }
  },
};
