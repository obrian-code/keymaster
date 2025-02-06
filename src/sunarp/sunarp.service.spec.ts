import { Test, TestingModule } from '@nestjs/testing';
import { SunarpService } from './sunarp.service';

describe('SunarpService', () => {
  let service: SunarpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SunarpService],
    }).compile();

    service = module.get<SunarpService>(SunarpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
