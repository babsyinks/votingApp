export type mockResponseType = {
  user: { username: string; userId: string; role?: string };
} | null;

export type mockErrorType = { message: string } | null;
