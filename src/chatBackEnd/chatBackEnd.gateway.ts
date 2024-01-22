import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatRoomService } from "./chatRoom.service";
import { setInitDTO, chatRoomListDTO } from "./dto/chatBackEnd.dto";
import { Observable, map, from } from "rxjs";
import { UserId } from "src/auth/decorators/userId.decorator";
import { UseGuards } from "@nestjs/common";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
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
            console.log("토큰받아옴", token);
            console.log(typeof token);
            const accessToken = token.auth;
            console.log(accessToken);
            console.log(typeof accessToken);
            this.handleAuthentication(client, accessToken);
        } catch (error) {
            console.error(error.message);
            throw new Error("소켓 연결에 문제가 생겼습니다.");
        }
    }

    //소켓 연결 해제시 유저목록에서 제거
    public handleDisconnect(client: Socket): void {
        const { roomId } = client.data;
        if (
            roomId != "room:lobby" &&
            !this.server.sockets.adapter.rooms.get(roomId)
        ) {
            this.ChatRoomService.deleteChatRoom(roomId);
            this.server.emit(
                "getChatRoomList",
                this.ChatRoomService.getChatRoomList(),
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
        // 실제 검증 로직이 들어가야함.
        if (typeof token !== "string") {
            throw new Error("토큰의 형식이 잘못 되었습니다.");
        }
        const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });

        const user = payload;
        console.log({ payload });
        // 인증된 유저 정보를 함수를 만들어 chatRoomService로 보내서
        // ChatRoomService에서 DB에 저장하게 만들자.
        return true;
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage("sendMessage")
    sendMessage(client: Socket, message: string): void {
        client.rooms.forEach((roomId) =>
            client.to(roomId).emit("getMessage", {
                id: client.id,
                nickname: client.data.nickname,
                message,
            }),
        );
    }

    //처음 접속시 닉네임 등 최초 설정
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

    //채팅방 목록 가져오기
    @SubscribeMessage("getChatRoomList")
    getChatRoomList(client: Socket, payload: any) {
        client.emit("getChatRoomList", this.ChatRoomService.getChatRoomList());
    }

    //채팅방 생성하기
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @SubscribeMessage("createChatRoom")
    createChatRoom(client: Socket, roomName: string, @UserId() userId: number) {
        //이전 방이 만약 나 혼자있던 방이면 제거
        console.log("userId", userId);
        if (
            client.data.roomId != "room:lobby" &&
            this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
        ) {
            this.ChatRoomService.deleteChatRoom(client.data.roomId);
        }

        this.ChatRoomService.createChatRoom(client, roomName, userId);
        return {
            roomId: client.data.roomId,
            roomName: this.ChatRoomService.getChatRoom(client.data.roomId)
                .roomName,
        };
    }

    //채팅방 들어가기
    @SubscribeMessage("enterChatRoom")
    enterChatRoom(client: Socket, roomId: string) {
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
