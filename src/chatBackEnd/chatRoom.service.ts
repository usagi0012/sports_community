import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { chatRoomListDTO } from "./dto/chatBackEnd.dto";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "src/entity/chat.entity";
import { UserPositionModule } from "src/user-position/user-position.module";
import { UserId } from "src/auth/decorators/userId.decorator";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Participants } from "src/entity/participants.entity";
import { Message } from "src/entity/message.entity";

@Injectable()
export class ChatRoomService {
    private chatRoomList: Record<string, chatRoomListDTO>;
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(Participants)
        private readonly participantsRepository: Repository<Participants>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.chatRoomList = {
            "room:lobby": {
                roomId: "room:lobby",
                roomName: "로비",
                cheifId: null,
            },
        };
    }
    async createChatRoom(client: Socket, roomName: string) {
        console.log("4");

        const userId = this.verifyToken(client);

        const roomId = `room:${uuidv4()}`;
        const nickname: string = client.data.nickname;
        console.log("5");
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
        console.log("6");
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);
        console.log("7");

        // 존재하는 채팅방 이름일 경우 에러
        console.log({ roomName });
        const chatName = await this.chatRepository.findOne({
            where: { title: roomName },
        });
        console.log({ chatName });
        if (chatName) {
            throw new Error("동일한 이름의 채팅방이 존재합니다.");
        }

        // 채팅방 생성시 roomName값 Chat 테이블에 저장
        this.chatRepository.save({
            title: roomName,
            creator: +userId,
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

    isRoomMember(client: Socket, roomId: string) {
        const userId = this.verifyToken(client);

        const roomMember = this.participantsRepository.findOne({
            where: { userId: +userId, chatId: +roomId },
        });

        if (!roomMember) {
            throw new ForbiddenException("초대되지 않은 사용자입니다.");
        }
    }

    // 로그인된 유저인지 체크
    verifyToken(client: Socket): string {
        const token = client.handshake.query;
        const accessToken = token.auth;

        console.log("토큰형식2", typeof accessToken);
        if (typeof accessToken !== "string") {
            throw new Error("토큰의 형식이 잘못 되었습니다.");
        }
        const payload = this.jwtService.verify(accessToken, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });

        if (!payload) {
            throw new NotFoundException("로그인이 필요합니다.");
        }

        const userId = payload.userId;

        console.log({ payload });
        return userId;
    }

    saveMessage(client: Socket, message: string, roomId: string) {
        console.log("******************************");
        const userId = this.verifyToken(client);
        console.log("******************************");

        console.log({ userId, roomId });
        // roomId 형태가 아니라 roomId에 title 형태가 들어있어서 roomId 형태로 가져오긴 해야함.
        this.messageRepository.save({
            userId: +userId,
            roomTitle: roomId,
            content: message,
        });
    }
}
