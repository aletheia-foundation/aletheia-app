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

  describe('ipfsAddressToHexSha256',()=>{
    it('should convert sample address ', inject([EncodingHelperService], (service: EncodingHelperService) => {
      const result = service.ipfsAddressToHexSha256('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
      expect(result).toBe('0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6')
    }));
  })

  describe('hexSha256ToIpfsMultiHash',()=>{
    it('should convert sample address ', inject([EncodingHelperService], (service: EncodingHelperService) => {
      const result = service.hexSha256ToIpfsMultiHash('0xbfccda787baba32b59c78450ac3d20b633360b43992c77289f9ed46d843561e6')
      expect(result).toBe('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')
    }));
  })
});
