import { Test, TestingModule } from '@nestjs/testing';
import { InfantController } from './infant.controller';
import { InfantService } from './infant.service';

describe('InfantController', () => {
  let controller: InfantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfantController],
      providers: [InfantService],
    }).compile();

    controller = module.get<InfantController>(InfantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
