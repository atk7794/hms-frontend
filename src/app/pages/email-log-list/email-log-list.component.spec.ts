import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogListComponent } from './email-log-list.component';

describe('EmailLogListComponent', () => {
  let component: EmailLogListComponent;
  let fixture: ComponentFixture<EmailLogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailLogListComponent]
    });
    fixture = TestBed.createComponent(EmailLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
