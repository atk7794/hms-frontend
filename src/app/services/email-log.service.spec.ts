import { TestBed } from '@angular/core/testing';

import { EmailLogService } from './email-log.service';

describe('EmailLogService', () => {
  let service: EmailLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
