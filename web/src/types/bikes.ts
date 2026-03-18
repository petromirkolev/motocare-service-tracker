export type Bike = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  created_at: string;
};

export type ListBikesResponse = {
  bikes: Bike[];
};

export type CreateBikeResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
