import { TestBed } from '@angular/core/testing';

import { EmailServiceService } from './email-service.service';

describe('EmailServiceService', () => {
  let service: EmailServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
