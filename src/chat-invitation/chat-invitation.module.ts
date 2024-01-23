import { Module } from "@nestjs/common";
import { ChatInvitationController } from "./chat-invitation.controller";
import { ChatInvitationService } from "./chat-invitation.service";
import { Participants } from "src/entity/participants.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Participants, Chat, User])],
    controllers: [ChatInvitationController],
    providers: [ChatInvitationService],
})
export class ChatInvitationModule {}
