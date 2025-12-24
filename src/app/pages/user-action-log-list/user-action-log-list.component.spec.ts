import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionLogListComponent } from './user-action-log-list.component';

describe('UserActionLogListComponent', () => {
  let component: UserActionLogListComponent;
  let fixture: ComponentFixture<UserActionLogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserActionLogListComponent]
    });
    fixture = TestBed.createComponent(UserActionLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
