import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages importları
import { MedicalRecordListComponent } from './pages/medical-record-list/medical-record-list.component';
import { UserActivityLogListComponent } from './pages/user-activity-log-list/user-activity-log-list.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PatientDashboardComponent } from './pages/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './pages/doctor-dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EmailLogListComponent } from './pages/email-log-list/email-log-list.component';
import { PrescriptionListComponent } from './pages/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './pages/prescription-form/prescription-form.component';
import { UserActionLogListComponent } from './pages/user-action-log-list/user-action-log-list.component';
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
//  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },

  // Dashboards
  { path: 'patient/dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard], data: { role: 'PATIENT' } },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard], data: { role: 'DOCTOR' } },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },

  // Prescription routes
  { path: 'doctor/prescriptions', component: PrescriptionListComponent, canActivate: [AuthGuard], data: { role: 'DOCTOR' } },
  { path: 'doctor/prescriptions/new', component: PrescriptionFormComponent, canActivate: [AuthGuard], data: { role: 'DOCTOR' } },
  { path: 'doctor/prescriptions/edit/:id', component: PrescriptionFormComponent, canActivate: [AuthGuard], data: { role: 'DOCTOR' } },
  { path: 'patient/prescriptions', component: PrescriptionListComponent, canActivate: [AuthGuard], data: { role: 'PATIENT' } },
  { path: 'admin/prescriptions', component: PrescriptionListComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'admin/prescriptions/edit/:id', component: PrescriptionFormComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },


  // User Action Log (admin only)
  { path: 'admin/user-action-logs', component: UserActionLogListComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },

  // Email logs
  { path: 'admin/email-logs', component: EmailLogListComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },

  // Activity logs
  { path: 'admin/activity-logs', component: UserActivityLogListComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },

  // Medical records
  { path: 'admin/medical-records', component: MedicalRecordListComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'doctor/medical-records', component: MedicalRecordListComponent, canActivate: [AuthGuard], data: { role: 'DOCTOR' } },
  { path: 'patient/medical-history', component: MedicalRecordListComponent, canActivate: [AuthGuard], data: { role: 'PATIENT' } },

  // wildcard route HER ZAMAN EN SONDA
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // bilinmeyen route'lar home'a yönlendir
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




