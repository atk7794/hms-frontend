import { Component, OnInit, ViewChild } from '@angular/core';
import { UserActivityLogService, UserActivityLog } from '../../services/user-activity-log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-activity-log-list',
  templateUrl: './user-activity-log-list.component.html',
  styleUrls: ['./user-activity-log-list.component.scss']
})
export class UserActivityLogListComponent implements OnInit {
  logs: UserActivityLog[] = [];
  filteredLogs = new MatTableDataSource<UserActivityLog>([]);
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = ['index', 'username', 'ipAddress', 'loginAt', 'logoutAt', 'duration'];

  filterUsername = '';
  filterIp = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userActivityLogService: UserActivityLogService) {}

  ngOnInit(): void {
    this.loadLogs();

    // Her saniye aktif kullanıcıların sürelerini güncelle
    setInterval(() => {
      this.logs.forEach(log => {
        if (!log.logoutAt) {
          const login = new Date(log.loginAt);
          const now = new Date();
          log.durationSeconds = Math.floor((now.getTime() - login.getTime()) / 1000);
          log.durationFormatted = this.formatDuration(log.durationSeconds);
        }
      });
      this.filteredLogs.data = [...this.logs]; // Table refresh
    }, 1000);
  }

  private attachPaginatorAndSortWhenReady() {
    setTimeout(() => {
      if (this.paginator) this.filteredLogs.paginator = this.paginator;
      if (this.sort) this.filteredLogs.sort = this.sort;
    }, 0);
  }

  loadLogs(): void {
    this.userActivityLogService.getAllLogs().subscribe({
      next: (data) => {
        this.logs = data
          .map((log) => {
            const login = new Date(log.loginAt);
            const logout = log.logoutAt ? new Date(log.logoutAt) : null;
            const durationSeconds = logout
              ? Math.floor((logout.getTime() - login.getTime()) / 1000)
              : 0;

            return {
              ...log,
              logoutAt: log.logoutAt ?? null,
              durationSeconds,
              durationFormatted: this.formatDuration(durationSeconds)
            };
          })
          .sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime());

        this.filteredLogs = new MatTableDataSource<UserActivityLog>(this.logs);
        this.attachPaginatorAndSortWhenReady();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Veriler alınırken hata oluştu.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  formatDuration(seconds: number | null | undefined): string {
    if (!seconds || seconds < 0) return '-';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    if (hours > 0) return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(sec)}`;
    return `${this.pad(minutes)}:${this.pad(sec)}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  applyFilter(): void {
    const username = this.filterUsername.toLowerCase();
    const ip = this.filterIp.toLowerCase();

    const filtered = this.logs.filter((log) => {
      const matchUser = log.username.toLowerCase().includes(username);
      const matchIp = log.ipAddress?.toLowerCase().includes(ip);
      const matchDate =
        (!this.filterStartDate || new Date(log.loginAt) >= this.filterStartDate) &&
        (!this.filterEndDate || new Date(log.loginAt) <= this.filterEndDate);
      return matchUser && matchIp && matchDate;
    });

    this.filteredLogs.data = filtered;

    if (this.filteredLogs.paginator) this.filteredLogs.paginator.firstPage();
  }

  clearFilters(): void {
    this.filterUsername = '';
    this.filterIp = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.applyFilter();
  }
}
