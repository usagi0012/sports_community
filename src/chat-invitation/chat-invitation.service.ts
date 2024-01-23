import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Participants } from "src/entity/participants.entity";
import { Repository } from "typeorm";
import { ChatExpelMemeberDto } from "./dto/chat-expelMember.dto";
import { ForbiddenException } from "@nestjs/common";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";

@Injectable()
export class ChatInvitationService {
    constructor(
        @InjectRepository(Participants)
        private readonly participantsRepository: Repository<Participants>,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async invitationToRoom(chatInvitationDto, userId) {
        const { memberId, chatId } = chatInvitationDto;

        // 방의 생성자가 아니면 초대 불가능 에러
        const isCreator = await this.chatRepository.findOne({
            where: { creator: userId, id: chatId },
        });
        if (!isCreator) {
            throw new ForbiddenException(
                "채팅방의 생성자만 초대를 할 수 있습니다.",
            );
        }

        // 존재하지 않는 유저이면 초대 불가능
        const existUser = await this.userRepository.findOne({
            where: { id: memberId },
        });
        if (!existUser) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        }

        // 이미 채팅방에 존재하는 경우 초대 불가능
        const joinedUser = await this.participantsRepository.findOne({
            where: { userId, chatId },
        });
        if (joinedUser) {
            throw new Error("이미 채팅방에 존재하는 유저입니다.");
        }
        const invitation = await this.participantsRepository.save({
            userId: memberId,
            chatId,
        });

        return invitation;
    }

    async expelMemberFromRoom(chatExpelMemberDto: ChatExpelMemeberDto) {
        const { memberId, chatId } = chatExpelMemberDto;
        const expeledMember = await this.participantsRepository.delete({});
    }
}
