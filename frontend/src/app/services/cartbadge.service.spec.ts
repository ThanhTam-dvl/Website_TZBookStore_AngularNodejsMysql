import { TestBed } from '@angular/core/testing';

import { CartBadgeService } from './cartbadge.service';

describe('CartbadgeService', () => {
  let service: CartBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
