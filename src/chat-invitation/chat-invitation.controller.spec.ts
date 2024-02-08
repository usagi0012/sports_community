import { Test, TestingModule } from '@nestjs/testing';
import { ChatInvitationController } from './chat-invitation.controller';

describe('ChatInvitationController', () => {
  let controller: ChatInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatInvitationController],
    }).compile();

    controller = module.get<ChatInvitationController>(ChatInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
