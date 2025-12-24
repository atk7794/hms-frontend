// src/app/models/user.model.ts
export interface User {
  id: number;
  email: string;
  role: string;   // "PATIENT" | "DOCTOR" | "ADMIN"
  patientId?: number; // 🔹 login sonrası backend'den dönen patientId (isteğe bağlı)
}
