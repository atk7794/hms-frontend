import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  appointments: Appointment[] = [];
  loading = false;
  error = '';

  selectedAppointment?: Appointment; // ✅ Düzenleme için

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.loading = true;
    this.error = '';
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Hata oluştu:', err);
        this.error = 'Randevular yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  deleteAppointment(id?: number): void {
    if (!id) return;
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => this.fetchAppointments(),
      error: (err) => {
        console.error('❌ Silme hatası:', err);
        alert('Silme işlemi başarısız oldu.');
      }
    });
  }

  editAppointment(appointment: Appointment) {
    this.selectedAppointment = appointment; // Form componentine gönderilecek
  }

  onFormSubmit() {
    this.selectedAppointment = undefined; // Form gönderildikten sonra resetle
    this.fetchAppointments(); // Listeyi yenile
  }
}
