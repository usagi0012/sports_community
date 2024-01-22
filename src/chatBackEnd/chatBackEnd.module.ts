import { Module } from "@nestjs/common";
import { ChatBackEndGateway } from "./chatBackEnd.gateway";
import { ChatRoomService } from "./chatRoom.service";
import { Chat } from "src/entity/chat.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Message } from "src/entity/message.entity";
import { Participants } from "src/entity/participants.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Chat,Message,Participants])],
    providers: [ChatBackEndGateway, ChatRoomService, JwtService, ConfigService],
})
export class ChatBackEndModule {}
