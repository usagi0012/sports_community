import { Test, TestingModule } from '@nestjs/testing';
import { ChatInvitationService } from './chat-invitation.service';

describe('ChatInvitationService', () => {
  let service: ChatInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatInvitationService],
    }).compile();

    service = module.get<ChatInvitationService>(ChatInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
