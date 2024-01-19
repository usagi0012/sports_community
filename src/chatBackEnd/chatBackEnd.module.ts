import { Module } from "@nestjs/common";
import { ChatBackEndGateway } from "./chatBackEnd.gateway";
import { ChatRoomService } from "./chatRoom.service";
import { Chat } from "src/entity/chat.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Chat])],
    providers: [ChatBackEndGateway, ChatRoomService],
})
export class ChatBackEndModule {}
