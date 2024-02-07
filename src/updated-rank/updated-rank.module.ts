import { Module } from '@nestjs/common';
import { UpdatedRankController } from './updated-rank.controller';
import { UpdatedRankService } from './updated-rank.service';

@Module({
  controllers: [UpdatedRankController],
  providers: [UpdatedRankService]
})
export class UpdatedRankModule {}
