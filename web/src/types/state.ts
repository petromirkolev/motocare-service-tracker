import type { Bike } from './bikes';
import type { Job } from './job';

export type StoreState = {
  bikes: Bike[];
  jobs: Job[];
};

type AppState = {
  selectedBikeId: string | null;
};

export const appState: AppState = {
  selectedBikeId: null,
};
