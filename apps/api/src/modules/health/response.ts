export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
  };
  error: null | { message: string };
}

export function ok<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: { requestId: crypto.randomUUID() },
    error: null
  };
}

