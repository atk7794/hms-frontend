import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmailLog, EmailLogService } from '../../services/email-log.service';

@Component({
  selector: 'app-email-log-list',
  templateUrl: './email-log-list.component.html',
  styleUrls: ['./email-log-list.component.scss']
})
export class EmailLogListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'recipient', 'subject', 'success', 'sentAt', 'errorMessage'];
  dataSource = new MatTableDataSource<EmailLog>();
  loading = true;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private emailLogService: EmailLogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.emailLogService.getAllLogs().subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a, b) =>
          new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Veriler alınırken hata oluştu.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
