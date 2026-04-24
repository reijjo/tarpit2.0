export type ApiResponse<T = undefined> = {
  success: boolean;
  error?: string;
  message?: string;
  status?: number;
  data?: T;
};
