import { Module } from "@nestjs/common";
import { ChatInvitationController } from "./chat-invitation.controller";
import { ChatInvitationService } from "./chat-invitation.service";
import { Participants } from "src/entity/participants.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Participants])],
    controllers: [ChatInvitationController],
    providers: [ChatInvitationService],
})
export class ChatInvitationModule {}
