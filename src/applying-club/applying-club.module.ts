import { Module } from '@nestjs/common';
import { ApplyingClubController } from './applying-club.controller';
import { ApplyingClubService } from './applying-club.service';

@Module({
  controllers: [ApplyingClubController],
  providers: [ApplyingClubService]
})
export class ApplyingClubModule {}
