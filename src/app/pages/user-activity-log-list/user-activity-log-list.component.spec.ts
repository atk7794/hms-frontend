import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityLogListComponent } from './user-activity-log-list.component';

describe('UserActivityLogListComponent', () => {
  let component: UserActivityLogListComponent;
  let fixture: ComponentFixture<UserActivityLogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserActivityLogListComponent]
    });
    fixture = TestBed.createComponent(UserActivityLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
