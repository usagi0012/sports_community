import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { chatRoomListDTO } from "./dto/chatBackEnd.dto";
import { Socket } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "src/entity/chat.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Participants } from "src/entity/participants.entity";
import { Message } from "src/entity/message.entity";
import { WsException } from "@nestjs/websockets";
import { User } from "src/entity/user.entity";

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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    async createChatRoom(client: Socket, roomName: string) {
        const userId = client["userId"];

        // const roomId = `room:${uuidv4()}`;
        const nickname: string = client.data.nickname;
        client.emit("getMessage", {
            id: null,
            nickname: "안내",
            message:
                '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
        });

        // 존재하는 채팅방 이름일 경우     에러
        const chatName = await this.chatRepository.findOne({
            where: { title: roomName },
        });
        if (chatName) {
            throw new WsException("동일한 이름의 채팅방이 존재합니다.");
        }

        // 채팅방 생성시 roomName값 Chat 테이블에 저장
        const room = await this.chatRepository.save({
            title: roomName,
            creator: +userId,
        });

        return room;
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

    // 내가 있는 채팅방만 가져오도록 변경하기
    async getChatRoomList(client) /* : Record<string, chatRoomListDTO> */ {
        // const userId = this.verifyToken(client);
        const userId = client["userId"];

        const myInfo = await this.participantsRepository.find({
            where: { userId: +userId },
        });

        const roomInfo = { title: [], id: [] };

        const creatorRoom = await this.chatRepository.find({
            where: { creator: +userId },
            order: { createdAt: "DESC" },
        });

        // 내가 참가해 있는 방 보내기 (생성했거나 참가되어 있는 방)
        creatorRoom.forEach((chat) => {
            roomInfo.title.push(chat.title);
            roomInfo.id.push(chat.id);
        });

        const myRoomList = myInfo.map((participants) => participants.chatId);

        const myRoomTitlePromises = await myRoomList.map(async (v) => {
            const chatRoom = await this.chatRepository.findOne({
                where: { id: v },
            });
            if (!roomInfo.title.includes(chatRoom.title)) {
                roomInfo.title.push(chatRoom.title);
            }
            if (!roomInfo.id.includes(chatRoom.id)) {
                roomInfo.id.push(v);
            }
            return chatRoom.title;
        });
        const myRoomTitle = await Promise.all(myRoomTitlePromises);

        return roomInfo;
        // return this.chatRoomList;
    }

    deleteChatRoom(roomId: string) {
        delete this.chatRoomList[roomId];
    }

    isRoomMember(client: Socket, roomId: string) {
        // const userId = this.verifyToken(client);
        const userId = client["userId"];

        const roomMember = this.participantsRepository.findOne({
            where: { userId: +userId, chatId: +roomId },
        });

        if (!roomMember) {
            throw new WsException("초대되지 않은 사용자입니다.");
        }
    }

    async saveMessage(client: Socket, message: string, roomId: string) {
        // const userId = this.verifyToken(client);
        const userId = client["userId"];

        const userInfo = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userName = userInfo.name;
        // roomId 형태가 아니라 roomId에 title 형태가 들어있어서 roomId 형태로 가져오긴 해야함.
        this.messageRepository.save({
            userId: +userId,
            roomId: +roomId,
            content: message,
            userName,
        });
    }

    async getName(client: Socket) {
        // const userId = this.verifyToken(client);
        const userId = client["userId"];
        const userInfo = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userName = userInfo.name;
        return userName;
    }
}
