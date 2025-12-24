import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserActionLogService } from '../../services/user-action-log.service';
import { UserActionLog } from '../../models/user-action-log.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-action-log-list',
  templateUrl: './user-action-log-list.component.html',
  styleUrls: ['./user-action-log-list.component.scss']
})
export class UserActionLogListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'action', 'description', 'createdAt'];
  dataSource = new MatTableDataSource<UserActionLog>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private logService: UserActionLogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLogs();

    // Edit sonrası veya route değişince listeyi güncelle
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.loadLogs());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLogs(): void {
    this.loading = true;
    this.logService.getAll().subscribe(res => {
      this.dataSource.data = res;
      this.loading = false;
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
