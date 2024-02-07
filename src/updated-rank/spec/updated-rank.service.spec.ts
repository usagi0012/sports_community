import { Test, TestingModule } from '@nestjs/testing';
import { UpdatedRankService } from './updated-rank.service';

describe('UpdatedRankService', () => {
  let service: UpdatedRankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatedRankService],
    }).compile();

    service = module.get<UpdatedRankService>(UpdatedRankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
