import { Injectable } from "@nestjs/common";
import { chatRoomListDTO } from "./dto/chatBackEnd.dto";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "src/entity/chat.entity";
import { UserPositionModule } from "src/user-position/user-position.module";
import { UserId } from "src/auth/decorators/userId.decorator";

@Injectable()
export class ChatRoomService {
    private chatRoomList: Record<string, chatRoomListDTO>;
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
    ) {
        this.chatRoomList = {
            "room:lobby": {
                roomId: "room:lobby",
                roomName: "로비",
                cheifId: null,
            },
        };
    }
    createChatRoom(client: Socket, roomName: string, userId: number): void {
        const roomId = `room:${uuidv4()}`;
        const nickname: string = client.data.nickname;
        console.log({ client });
        console.log("클라이언트 아이디", client.id);
        client.emit("getMessage", {
            id: null,
            nickname: "안내",
            message:
                '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
        });
        // return this.chatRoomList[roomId];
        this.chatRoomList[roomId] = {
            roomId,
            cheifId: client.id,
            roomName,
        };
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);

        // 채팅방 생성시 roomName값 Chat 테이블에 저장
        this.chatRepository.save({
            title: roomName,
            creator: userId,
        });
    }

    enterChatRoom(client: Socket, roomId: string) {
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);
        const { nickname } = client.data;
        const { roomName } = this.getChatRoom(roomId);
        client.to(roomId).emit("getMessage", {
            id: null,
            nickname: "안내",
            message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
        });
        console.log({ roomName });
        console.log({ nickname });
        console.log({ roomId });
    }

    exitChatRoom(client: Socket, roomId: string) {
        client.data.roomId = `room:lobby`;
        client.rooms.clear();
        client.join(`room:lobby`);
        const { nickname } = client.data;
        client.to(roomId).emit("getMessage", {
            id: null,
            nickname: "안내",
            message: '"' + nickname + '"님이 방에서 나갔습니다.',
        });
    }

    getChatRoom(roomId: string): chatRoomListDTO {
        return this.chatRoomList[roomId];
    }

    getChatRoomList(): Record<string, chatRoomListDTO> {
        return this.chatRoomList;
    }

    deleteChatRoom(roomId: string) {
        delete this.chatRoomList[roomId];
    }

    saveUserData(userId) {}
}
