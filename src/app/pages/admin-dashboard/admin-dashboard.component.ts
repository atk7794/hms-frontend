import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ EKLENDİ

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  // activeTab tipine 'prescriptions' ve 'userActionLogs' ekleyelim
  activeTab: 'patients' | 'doctors' | 'appointments' | 'emails' | 'activityLogs' | 'medicalRecords' | 'prescriptions' | 'actionLogs' = 'patients';
  showAddForm = false;
  selectedRecord: any = null;
  viewMode: boolean = false;

  constructor(
    private route: ActivatedRoute,  // ✅ EKLENDİ
    private router: Router          // ✅ EKLENDİ
  ) {}

  ngOnInit(): void {
    // URL'deki ?tab= parametresine göre sekmeyi belirle
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab') as typeof this.activeTab;
      if (tab) this.activeTab = tab;
    });
  }

  // 🔹 Sekme değiştir
  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
    this.showAddForm = false;

    // URL'yi güncelle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
  }

  onRecordSaved() {
    this.showAddForm = false;
    this.selectedRecord = null;
  }

  onEditRecord(record: any) {
    this.selectedRecord = record;
    this.showAddForm = true;
    this.viewMode = false; // düzenleme modu
  }

  onViewRecord(record: any) {
    this.selectedRecord = record;
    this.showAddForm = true;
    this.viewMode = true; // sadece görüntüleme
  }
}
