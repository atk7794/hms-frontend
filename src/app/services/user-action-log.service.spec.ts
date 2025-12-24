import { TestBed } from '@angular/core/testing';

import { UserActionLogService } from './user-action-log.service';

describe('UserActionLogService', () => {
  let service: UserActionLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActionLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
