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
            cache: true,
        });

        return messages;
    }
}
