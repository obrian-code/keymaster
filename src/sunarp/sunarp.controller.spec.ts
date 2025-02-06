import { Test, TestingModule } from '@nestjs/testing';
import { SunarpController } from './sunarp.controller';

describe('SunarpController', () => {
  let controller: SunarpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SunarpController],
    }).compile();

    controller = module.get<SunarpController>(SunarpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
