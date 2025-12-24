export interface Prescription {
  id: number;
  prescriptionCode: string;  // ✅ backend'deki unique e-prescription code alanı
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  medicalRecordId?: number; // opsiyonel
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: string; // ISO string olarak backend’den geliyor
  updatedAt: string;
}


export interface PrescriptionRequest {
  patientId: number;
  doctorId: number;
  prescriptionCode?: string;    // opsiyonel
  medicalRecordId?: number;     // opsiyonel
  medication: string;
  dosage: string;
  instructions: string;
}
