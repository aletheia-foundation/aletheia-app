import { TestBed, inject } from '@angular/core/testing';

import { EncodingHelperService } from './encoding-helper.service';

describe('EncodingHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncodingHelperService]
    });
  });

  it('should be created', inject([EncodingHelperService], (service: EncodingHelperService) => {
    expect(service).toBeTruthy();
  }));
});
