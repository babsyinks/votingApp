export interface MiniFiedUser {
  userId: string;
  username: string;
  role: string;
  [key: string]: unknown; // allow extra fields
}
