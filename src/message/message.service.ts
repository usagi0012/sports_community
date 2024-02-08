import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entity/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async getRoomMessage(roomId) {
        const messages = await this.messageRepository.find({
            where: { roomId },
            order: { createdAt: "ASC" },
            cache: true, // 적절한 캐시 설정을 추가하기,
        });

        return messages;
    }
}
