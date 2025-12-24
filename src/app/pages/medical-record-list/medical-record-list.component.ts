import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MedicalRecordService} from "../../services/medical-record.service";
import {MedicalRecord} from "../../models/medical-record.model";
import {AuthService} from "../../services/auth.service";
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-medical-record-list',
  templateUrl: './medical-record-list.component.html',
  styleUrls: ['./medical-record-list.component.scss']
})
export class MedicalRecordListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'patient', 'doctor', 'diagnosis', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<MedicalRecord>([]);
  loading = true;
  error: string | null = null;

  // filtre alanları
  filterPatient = '';
  filterDoctor = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  // Eğer component'i patient bazlı kullanmak istersen: patientId input verilebilir
  @Input() patientId?: number;

  @Output() editRecord = new EventEmitter<MedicalRecord>();
  @Output() viewRecord = new EventEmitter<MedicalRecord>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService // opsiyonel, rol kontrolü için
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRecords(): void {
    this.loading = true;
    const obs = this.patientId ? this.medicalRecordService.getByPatient(this.patientId) : this.medicalRecordService.getAll();
    obs.subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
        this.applyFilter(); // varsa filtre uygula
      },
      error: (err) => {
        this.error = 'Kayıtlar alınırken hata oluştu.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // client-side filtre
  applyFilter(): void {
    const patient = this.filterPatient.trim().toLowerCase();
    const doctor = this.filterDoctor.trim().toLowerCase();
    const start = this.filterStartDate ? new Date(this.filterStartDate).setHours(0,0,0,0) : null;
    const end = this.filterEndDate ? new Date(this.filterEndDate).setHours(23,59,59,999) : null;

    this.dataSource.data = (this.dataSource.data.length ? this.dataSource.data : []).filter(r => {
      const matchPatient = `${r.patient.firstName} ${r.patient.lastName}`.toLowerCase().includes(patient);
      const matchDoctor = `${r.doctor.firstName} ${r.doctor.lastName}`.toLowerCase().includes(doctor);
      const created = new Date(r.createdAt).getTime();
      const matchDate = (!start || created >= start) && (!end || created <= end);
      return matchPatient && matchDoctor && matchDate;
    });

    // sayfayı 1'e resetle
    if (this.paginator) this.paginator.firstPage();
  }

  clearFilters(): void {
    this.filterPatient = '';
    this.filterDoctor = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.loadRecords();
  }

  // silme (admin için) — confirm eklemelisin
  deleteRecord(id: number): void {
    if (!confirm('Kayıdı silmek istediğinize emin misiniz?')) return;
    this.medicalRecordService.delete(id).subscribe({
      next: () => {
        this.loadRecords();
      },
      error: (err) => {
        alert('Silme sırasında hata: ' + err?.message);
      }
    });
  }

  // yardımcı: görüntüleme helper
  formatName(first: string, last: string) {
    return `${first} ${last}`;
  }

  onEdit(record: MedicalRecord): void {
    this.editRecord.emit(record);
  }

  onView(record: MedicalRecord): void {
    this.viewRecord.emit(record);
  }
  
}
