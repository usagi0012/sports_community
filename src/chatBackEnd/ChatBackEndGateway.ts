import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatRoomService } from "./chatRoom.service";
import { setInitDTO } from "./dto/chatBackEnd.dto";
import { NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway(5000, {
    cors: {
        origin: "http://localhost:8001",
    },
})
export class ChatBackEndGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly ChatRoomService: ChatRoomService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    @WebSocketServer()
    server: Server;

    //소켓 연결시 유저목록에 추가
    public handleConnection(client: Socket): void {
        try {
            console.log(this.server);
            console.log("connected", client.id);
            client.leave(client.id);
            client.data.roomId = `room:lobby`;
            client.join("room:lobby");

            const token = client.handshake.query;
            const accessToken = token.auth;
            console.log("서버로 가져온 토큰", accessToken);
        } catch (error) {
            console.error(error.message);
            throw new Error("로그인이 필요합니다.");
        }
    }

    //소켓 연결 해제시 유저목록에서  제거
    public handleDisconnect(client: Socket): void {
        const { roomId } = client.data;
        if (
            roomId != "room:lobby" &&
            !this.server.sockets.adapter.rooms.get(roomId)
        ) {
            this.ChatRoomService.deleteChatRoom(roomId);
            this.server.emit(
                "getChatRoomList",
                this.ChatRoomService.getChatRoomList(client),
            );
        }
        console.log("disonnected", client.id);
    }

    @SubscribeMessage("authenticate")
    handleAuthentication(client: Socket, accessToken: string | string[]) {
        if (this.verifyToken(accessToken)) {
            client.emit("authenticated");
        } else {
            client.emit("unauthorized", {
                message: "사용자 인증이 실패했습니다.",
            });
            client.disconnect(true);
        }
    }

    verifyToken(token: string | string[]): boolean {
        if (typeof token !== "string") {
            throw new WsException("토큰의 형식이 잘못 되었습니다.");
        }
        const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });

        if (!payload) {
            throw new NotFoundException("로그인이 필요합니다.");
        }

        const userId = payload.userId;
        console.log({ payload });

        return true;
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage("sendMessage")
    sendMessage(client: Socket, message: string): void {
        console.log("client.rooms", client.rooms);
        client.rooms.forEach((roomId) =>
            client.to(roomId).emit("getMessage", {
                id: client.id,
                nickname: client.data.nickname,
                message,
            }),
        );
        // 채팅 전송시 DB에 채팅 내역 저장
        client.rooms.forEach((roomId) => {
            console.log("1", client, message, roomId);
            this.ChatRoomService.saveMessage(client, message, roomId);
        });
    }

    //처음 접속시 닉네임 등 최초  설정
    @SubscribeMessage("setInit")
    setInit(client: Socket, data: setInitDTO): setInitDTO {
        // 이미 최초 세팅이 되어있는 경우 패스
        if (client.data.isInit) {
            return;
        }

        client.data.nickname = data.nickname
            ? data.nickname
            : "낯선사람" + client.id;

        client.data.isInit = true;

        return {
            nickname: client.data.nickname,
            room: {
                roomId: "room:lobby",
                roomName: "로비",
            },
        };
    }

    //닉네임 변경
    @SubscribeMessage("setNickname")
    setNickname(client: Socket, nickname: string): void {
        const { roomId } = client.data;
        client.to(roomId).emit("getMessage", {
            id: null,
            nickname: "안내",
            message: `"${client.data.nickname}"님이 "${nickname}"으로 닉네임을 변경하셨습니다.`,
        });
        client.data.nickname = nickname;
    }

    //채팅방 목록 가져오기 (여기부분 수정해서 내가 포함된 채팅방만 가져와보기)
    @SubscribeMessage("getChatRoomList")
    async getChatRoomList(client: Socket, payload: any) {
        console.log("here", this.ChatRoomService.getChatRoomList(client));
        client.emit(
            "getChatRoomList",
            await this.ChatRoomService.getChatRoomList(client),
        );
    }

    //채팅방 생성하기 (프론트에서 받는 곳)
    @SubscribeMessage("createChatRoom")
    createChatRoom(client: Socket, roomName: string) {
        //이전 방이 만약 나 혼자있던 방이면 제거
        try {
            if (
                client.data.roomId != "room:lobby" &&
                this.server.sockets.adapter.rooms.get(client.data.roomId)
                    .size == 1
            ) {
                this.ChatRoomService.deleteChatRoom(client.data.roomId);
            }
            this.ChatRoomService.createChatRoom(client, roomName);
            return {
                roomId: client.data.roomId,
                roomName: this.ChatRoomService.getChatRoom(client.data.roomId)
                    .roomName,
            };
        } catch (error) {
            console.error();
        }
    }

    //채팅방 들어가기
    @SubscribeMessage("enterChatRoom")
    enterChatRoom(client: Socket, roomId: string) {
        // 로그인 되어 있지 않은 경우, 룸에 가입된 멤버가 아닐경우 에러 처리
        this.ChatRoomService.isRoomMember(client, roomId);
        //이미 접속해있는 방 일 경우 재접속 차단
        if (client.rooms.has(roomId)) {
            return;
        }
        //이전 방이 만약 나 혼자있던 방이면 제거
        if (
            client.data.roomId != "room:lobby" &&
            this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
        ) {
            this.ChatRoomService.deleteChatRoom(client.data.roomId);
        }
        this.ChatRoomService.enterChatRoom(client, roomId);
        return {
            roomId: roomId,
            roomName: this.ChatRoomService.getChatRoom(roomId).roomName,
        };
    }
}