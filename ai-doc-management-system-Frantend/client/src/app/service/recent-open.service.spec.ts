import { TestBed } from '@angular/core/testing';

import { RecentOpenService } from './recent-open.service';

describe('RecentOpenService', () => {
  let service: RecentOpenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentOpenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
