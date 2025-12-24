import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit, AfterViewInit {
  @Input() role: string = '';
  @Input() userId!: number;

  displayedColumns: string[] = [
    'prescriptionCode', 'patientName', 'doctorName', 'medicalRecordId', 'medication', 'dosage', 'instructions', 'createdAt', 'updatedAt'
  ];

  dataSource = new MatTableDataSource<Prescription>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Edit sonrası veya navigation sonrası table'ı güncelle
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadPrescriptions();
      });
  }

  ngOnInit(): void {
    if (!this.userId) {
      this.route.queryParamMap.subscribe((params: import('@angular/router').ParamMap) => {
        const uid = params.get('userId');
        if (uid) this.userId = +uid;
        this.loadPrescriptions();
      });
    } else {
      this.loadPrescriptions();
    }
  }

  ngAfterViewInit(): void {
    // paginator ve sort'u ata
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  get displayedColumnsWithActions(): string[] {
    return (this.role === 'DOCTOR' || this.role === 'ADMIN')
      ? [...this.displayedColumns, 'actions']
      : this.displayedColumns;
  }

  loadPrescriptions(): void {
    this.loading = true;

    if (this.role === 'PATIENT') {
      this.patientService.getByUserId(this.userId).subscribe(patient => {
        if (patient?.id) {
          this.prescriptionService.getByPatientId(patient.id).subscribe(res => this.setTableData(res));
        } else {
          this.setTableData([]);
        }
      });
    }
    else if (this.role === 'DOCTOR') {
      // userId -> doctorId
      this.doctorService.getDoctorByUserId(this.userId).subscribe({
        next: doctor => {
          if (doctor?.id) {
            this.prescriptionService.getByDoctorId(doctor.id).subscribe(res => this.setTableData(res));
          } else {
            this.setTableData([]);
          }
        },
        error: err => {
          console.error('Doktor bulunamadı:', err);
          this.setTableData([]);
        }
      });
    }
    else if (this.role === 'ADMIN') {
      this.prescriptionService.getAll().subscribe(res => this.setTableData(res));
    }
    else {
      this.setTableData([]);
    }
  }

  private setTableData(data: Prescription[]): void {
    this.dataSource.data = data;

    // paginator ve sort tekrar bağlanıyor
    setTimeout(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });

    this.loading = false;
  }

//  private setTableData(data: Prescription[]): void {
//    this.dataSource.data = data;
//    // paginator ve sort sadece hazırsa ata
//    if (this.paginator) this.dataSource.paginator = this.paginator;
//    if (this.sort) this.dataSource.sort = this.sort;
//    this.loading = false;
//  }

  deletePrescription(id: number): void {
    if (confirm('Bu reçeteyi silmek istediğinize emin misiniz?')) {
      this.prescriptionService.delete(id).subscribe(() => {
        // Silme sonrası listeyi yeniden yükle
        this.loadPrescriptions();
      });
    }
  }

  editPrescription(id: number): void {
    if (this.role === 'DOCTOR') {
      this.router.navigate(['/doctor/prescriptions/edit', id]);
    } else if (this.role === 'ADMIN') {
      this.router.navigate(['/admin/prescriptions/edit', id]);
    }
  }
}
