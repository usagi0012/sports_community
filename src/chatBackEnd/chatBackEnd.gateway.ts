import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
    ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatRoomService } from "./chatRoom.service";
import { setInitDTO, chatRoomListDTO } from "./dto/chatBackEnd.dto";
import { Observable, map, from } from "rxjs";
import { UserId } from "src/auth/decorators/userId.decorator";
import {
    NotFoundException,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway({
    transports: ["websocket"],
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

    //소켓 연결시 유저목록에  추가
    public handleConnection(@ConnectedSocket() client: Socket): void {
        try {
            console.log("connected", client.id);

            client.join("room:lobby");
            const { auth } = client.handshake.query;
            const userId = this.verifyToken(auth);

            if (userId == null) {
                throw new UnauthorizedException();
            }
            client["userId"] = userId;
            console.log("client", client);
        } catch (error) {
            console.error(error.message);
        }
    }

    //소켓 연결 해제시 유저목록에서 제거 (console.log빼고 없어도 될듯)
    public handleDisconnect(client: Socket): void {
        const { roomId } = client.data;
        console.log(2);

        if (
            roomId != "room:lobby" &&
            !this.server.sockets.adapter.rooms.get(roomId)
        ) {
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

    verifyToken(token: string | string[]) {
        try {
            if (typeof token !== "string") {
                throw new WsException("토큰의 형식이 잘못 되었습니다.");
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>(
                    "JWT_ACCESS_TOKEN_SECRET",
                ),
            });

            if (!payload) {
                throw new WsException("로그인이 필요합니다.");
            }

            const userId = payload.userId;

            return userId;
        } catch (error) {
            console.log(error);
            if ((error.message = "jwt expired")) {
                return null;
            }
        }
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage("sendMessage")
    async sendMessage(client: Socket, data: any) {
        const { roomId, message } = data;

        // 닉네임 뽑아오기
        const userName = await this.ChatRoomService.getName(client);
        this.server.to(roomId).emit("getMessage", {
            //실제 데이터로 바꾸기
            id: client.id,
            nickname: userName,
            message,
            roomId,
        });
        console.log("getMessage서버에서 보낸 뒤");

        // 채팅 전송시 DB에 채팅 내역 저장(변경된 저장방법)
        await this.ChatRoomService.saveMessage(client, message, roomId);
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

        // 처음 접속시 들어가는 방이 없는데 로비 말고 설정을 안해줘도 되려나...?
        return {
            nickname: client.data.nickname,
            room: {
                roomId: null,
                roomName: null,
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

    //채팅방 목록 가져오기 (여기 부분 수정해서 내가 포함된 채팅방만 가져와보기)
    @SubscribeMessage("getChatRoomList")
    async getChatRoomList(client: Socket, payload: any) {
        try {
            if (client["userId"] == null) {
                throw new UnauthorizedException();
            }
            client.emit(
                "getChatRoomList",
                await this.ChatRoomService.getChatRoomList(client),
            );
        } catch (error) {
            console.log(error);

            return false;
        }
    }

    //채팅방 생성하기 (프론트에서 받는 곳)
    @SubscribeMessage("createChatRoom")
    async createChatRoom(client: Socket, roomName: string) {
        //이전 방이 만약 나 혼자있던 방이면 제거
        try {
            const chatRoom = await this.ChatRoomService.createChatRoom(
                client,
                roomName,
            );
            return {
                roomId: chatRoom.id,
                roomName: chatRoom.title,
            };
        } catch (error) {
            console.error();
        }
    }

    //채팅방 들어가기
    @SubscribeMessage("enterChatRoom")
    enterChatRoom(client: Socket, roomId: string) {
        client.rooms.clear();
        client.join(roomId);
        return {
            roomId: roomId,
            roomName: "??",
        };
    }
}
