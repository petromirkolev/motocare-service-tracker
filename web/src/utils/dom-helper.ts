/* Helper functions for DOM manipulation related to the motorcycle maintenance assistant application. */

export function req<T extends HTMLElement>(el: T | null, name: string): T {
  if (!el) throw new Error(`Missing DOM element: ${name}`);
  return el;
}
