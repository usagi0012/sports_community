import { Body, Controller, Post, UseGuards } from "@nestjs/common";
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
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post()
    async invitationToRoom(
        @Body() chatinvitationDto: ChatInvitationDto,
        @UserId() userId: number,
    ) {
        try {
            const invitation =
                await this.chatInvitationService.invitationToRoom(
                    chatinvitationDto,
                    userId,
                );

            return {
                statusCode: 200,
                message: "멤버가 정상적으로 초대되었습니다.",
                data: invitation,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "멤버 초대에 실패했습니다.",
                error: error.meessage,
            };
        }
    }

    // 방의 주인인지 확인해야함.
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    async expelMemberFromRoom(
        @Body() chatExpelMemberDto: ChatExpelMemeberDto,
        @UserId() userId: number,
    ) {
        try {
            const expeledMember =
                await this.chatInvitationService.expelMemberFromRoom(
                    chatExpelMemberDto,
                );

            return {
                statusCode: 200,
                message: "멤버 삭제에 성공했습니다.",
                data: expeledMember,
            };
        } catch (error) {
            return {
                statusCode: 400,
                message: "멤버 삭제에 실패했습니다.",
                error: error.message,
            };
        }
    }
}
