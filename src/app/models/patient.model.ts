export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO format (ör: "2025-10-05")
  gender: string;
}
