/* Entry point for the Moto Care Jobs web application. */

import './style.css';
import { bindEvents } from './ui/router';
import { render } from './dom/render';
import { getCurrentUser } from './state/auth-store';

const user = getCurrentUser();

user ? render.bikeScreen() : render.initialScreen();

bindEvents();
