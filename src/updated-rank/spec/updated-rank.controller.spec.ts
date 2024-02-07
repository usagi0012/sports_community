import { Test, TestingModule } from '@nestjs/testing';
import { UpdatedRankController } from './updated-rank.controller';

describe('UpdatedRankController', () => {
  let controller: UpdatedRankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatedRankController],
    }).compile();

    controller = module.get<UpdatedRankController>(UpdatedRankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
