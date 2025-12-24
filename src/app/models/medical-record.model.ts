export interface PatientResponse {
  id: number;
  firstName: string;
  lastName: string;
  userId?: number;
}

export interface DoctorResponse {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
  userId?: number;
}

export interface MedicalRecord {
  id: number;
  patient: PatientResponse;
  doctor: DoctorResponse;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordRequest {
  patientId: number;
  doctorId: number;
  diagnosis: string;
  prescription?: string;
  notes?: string;
}
