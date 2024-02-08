import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ChatInvitationService } from "./chat-invitation.service";
import { ChatInvitationDto } from "./dto/chat-Invitation.dto";
import { ChatExpelMemeberDto } from "./dto/chat-expelMember.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { UserId } from "src/auth/decorators/userId.decorator";

@Controller("chat-invitation")
export class ChatInvitationController {
    constructor(
        private readonly chatInvitationService: ChatInvitationService,
    ) {}

    // 방의 주인인지 확인해야 함.
    // 채팅방 초대
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post("/:roomId")
    async invitationToRoom(
        @Body() chatinvitationDto: ChatInvitationDto,
        @Param("roomId") roomId: number,
        @UserId() userId: number,
    ) {
        try {
            console.log("서버에 도착함?");
            const invitation =
                await this.chatInvitationService.invitationToRoom(
                    chatinvitationDto,
                    roomId,
                    userId,
                );

            return {
                statusCode: 200,
                message: "멤버가 정상적으로 초대되었습니다.",
                data: invitation,
            };
        } catch (error) {
            console.log("zz", error.message);
            return {
                data: `${error.message}`,
            };
        }
    }

    // 방의 주인인지 확인해야함.
    // 채팅방 추방
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete("/:roomId")
    async expelMemberFromRoom(
        @Body() chatExpelMemberDto: ChatExpelMemeberDto,
        @UserId() userId: number,
        @Param("roomId") roomId: number,
    ) {
        try {
            console.log("백엔드 여기 들어와야함");
            const expeledMember =
                await this.chatInvitationService.expelMemberFromRoom(
                    chatExpelMemberDto,
                    roomId,
                    userId,
                );

            return {
                statusCode: 200,
                message: "멤버 추방에 성공했습니다.",
                data: expeledMember,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "멤버 추방에 실패했습니다.",
                error: error.message,
            };
        }
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/:roomId")
    async isCreator(@UserId() userId: number, @Param("roomId") roomId: number) {
        try {
            console.log("왜 여기 들어옴?");
            const creator = await this.chatInvitationService.isCreator(
                userId,
                roomId,
            );

            return {
                statusCode: 200,
                message: "룸 생성자 조회에 성공했습니다.",
                data: creator,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "룸 생성자 조회에 실패했습니다.",
                error: error.message,
            };
        }
    }
}
