export interface UserActionLog {
  id: number;
  username: string;
  action: string;
  description: string;
  createdAt: string; // ISO string
}
