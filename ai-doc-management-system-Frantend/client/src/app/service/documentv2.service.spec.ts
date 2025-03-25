import { TestBed } from '@angular/core/testing';

import { Documentv2Service } from './documentv2.service';

describe('Documentv2Service', () => {
  let service: Documentv2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Documentv2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
