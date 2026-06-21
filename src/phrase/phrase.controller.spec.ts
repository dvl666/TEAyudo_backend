import { Test, TestingModule } from '@nestjs/testing';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';

describe('PhraseController', () => {
  let controller: PhraseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhraseController],
      providers: [PhraseService],
    }).compile();

    controller = module.get<PhraseController>(PhraseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
