import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Participants } from "src/entity/participants.entity";
import { Repository } from "typeorm";
import { ChatExpelMemeberDto } from "./dto/chat-expelMember.dto";
import { ForbiddenException } from "@nestjs/common";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";
import { UserProfile } from "src/entity/user-profile.entity";

@Injectable()
export class ChatInvitationService {
    constructor(
        @InjectRepository(Participants)
        private readonly participantsRepository: Repository<Participants>,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
    ) {}

    async invitationToRoom(chatInvitationDto, roomId, userId) {
        const { nickName } = chatInvitationDto;
        // 방의 생성자가 아니면 초대 불가능 에러
        const isCreator = await this.chatRepository.findOne({
            where: { creator: userId, id: roomId },
        });
        if (!isCreator) {
            throw new ForbiddenException(
                "채팅방의 생성자만 초대를 할 수 있습니다.",
            );
        }
        // 존재하지 않는 유저이면 초대 불가능
        const existUser = await this.userProfileRepository.findOne({
            where: { nickname: nickName },
            select: ["id", "nickname", "userId"],
        });
        if (!existUser) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        }

        const memberId = existUser.userId;
        // 이미 채팅방에 존재하는 경우 초대 불가능
        const joinedUser = await this.participantsRepository.findOne({
            where: { userId: memberId, chatId: roomId },
        });
        if (joinedUser) {
            throw new ForbiddenException("이미 채팅방에 존재하는 유저입니다.");
        }
        const invitation = await this.participantsRepository.save({
            userId: memberId,
            chatId: roomId,
        });

        return invitation;
    }

    async expelMemberFromRoom(
        chatExpelMemberDto: ChatExpelMemeberDto,
        roomId: number,
        userId: number,
    ) {
        const { nickName } = chatExpelMemberDto;

        const isCreator = await this.chatRepository.findOne({
            where: { creator: userId, id: roomId },
        });
        if (!isCreator) {
            throw new ForbiddenException(
                "채팅방의 생성자만 초대를 할 수 있습니다.",
            );
        }
        // 존재하지 않는 유저이면 초대 불가능
        const existUser = await this.userProfileRepository.findOne({
            where: { nickname: nickName },
            select: ["id", "nickname", "userId"],
        });
        if (!existUser) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        }

        const memberId = existUser.userId;

        const expeledMember = await this.participantsRepository.delete({
            userId: memberId,
            chatId: roomId,
        });
        return expeledMember;
    }

    async isCreator(userId: number, roomId: number) {
        // 현재 방의 생성자인지 확인
        const room = await this.chatRepository.findOne({
            where: { id: roomId },
        });
        if (!room) {
            throw new NotFoundException("룸이 존재하지 않습니다.");
        }
        const creator = room.creator;

        if (creator !== userId) {
            throw new UnauthorizedException(
                "방의 생성자만 멤버를 초대할 수 있습니다.",
            );
        }

        return "성공";
    }

    async exitRoom(roomId, userId) {
        const room = await this.chatRepository.findOne({
            where: { id: roomId },
        });
        if (!room) {
            throw new NotFoundException("룸이 존재하지 않습니다.");
        }
        const creator = room.creator;

        if (creator == userId) {
            throw new UnauthorizedException("방의 생성자는 나갈 수 없습니다.");
        }

        return await this.participantsRepository.delete({
            userId,
            chatId: roomId,
        });
    }

    async deleteRoom(roomId: number, userId: number) {
        const room = await this.chatRepository.findOne({
            where: { id: roomId },
        });
        if (!room) {
            throw new NotFoundException("룸이 존재하지 않습니다.");
        }

        const creator = room.creator;

        if (creator !== userId) {
            throw new UnauthorizedException(
                "방의 생성자만 채팅방을 삭제할 수 있습니다.",
            );
        }

        return await this.chatRepository.delete({ id: roomId });
    }
}
