import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { accessTokenGuard } from "src/auth/guard/access-token.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserId } from "src/auth/decorators/userId.decorator";

@Controller("message")
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("/:roomId")
    async getRoomMessage(
        @Param("roomId") roomId: number,
        @UserId() userId: number,
    ) {
        try {
            const message = await this.messageService.getRoomMessage(roomId);

            const result = { message, userId };
            return {
                statusCode: 200,
                message: "메세지 조회에 성공했습니다.",
                data: result,
            };
        } catch (error) {
            console.log(error);

            return {
                statusCode: 400,
                message: "메세지 조회에 실패했습니다.",
                error: error.message,
            };
        }
    }
}
