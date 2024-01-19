import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Participants } from "src/entity/participants.entity";
import { Repository } from "typeorm";
import { ChatExpelMemeberDto } from "./dto/chat-expelMember.dto";
import { ForbiddenException } from "@nestjs/common";

@Injectable()
export class ChatInvitationService {
    constructor(
        @InjectRepository(Participants)
        private readonly chatInvitationRepository: Repository<Participants>,
    ) {}

    async invitationToRoom(chatInvitationDto, userId) {
        const { memberId, chatId } = chatInvitationDto;

        // 방의 생성자가 아니면 초대 불가능 에러
        // const creator;
        // if (userId !== creator) {
        //     throw new ForbiddenException(
        //         "채팅방의 생성자만 초대를 할 수 있습니다.",
        //     );
        // }
        const invitation = await this.chatInvitationRepository.save({
            userId: memberId,
            chatId,
        });

        return invitation;
    }

    async expelMemberFromRoom(chatExpelMemberDto: ChatExpelMemeberDto) {
        const { memberId, chatId } = chatExpelMemberDto;
        const expeledMember = await this.chatInvitationRepository.delete({});
    }
}
