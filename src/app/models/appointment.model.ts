import { Patient } from './patient.model';
import { Doctor } from './doctor.model';

export interface Appointment {
  id?: number;
  patient: Patient;
  doctor: Doctor;
  appointmentDate: string; // "2025-10-05T10:30:00"
  status: string; // örn: "SCHEDULED", "CANCELLED", "COMPLETED"
}
