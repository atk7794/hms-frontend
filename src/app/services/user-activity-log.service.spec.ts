import { TestBed } from '@angular/core/testing';

import { UserActivityLogService } from './user-activity-log.service';

describe('UserActivityLogService', () => {
  let service: UserActivityLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActivityLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
