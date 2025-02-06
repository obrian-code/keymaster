import { Test, TestingModule } from '@nestjs/testing';
import { ReniecController } from './reniec.controller';

describe('ReniecController', () => {
  let controller: ReniecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReniecController],
    }).compile();

    controller = module.get<ReniecController>(ReniecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
