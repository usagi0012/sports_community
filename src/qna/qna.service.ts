import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateQnaDto } from "./dto/createQna.dto";
import { UpdateQnaDto } from "./dto/updateQna.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { Qna } from "src/entity/qna.entity";
import { AwsService } from "src/aws/aws.service";

@Injectable()
export class QnaService {
    constructor(
        @InjectRepository(User)
        private readonly userReporitory: Repository<User>,
        @InjectRepository(Qna)
        private readonly qnaReporitory: Repository<Qna>,
        private readonly awsService: AwsService,
    ) {}

    async createQna(
        userId: number,
        createQnaDto: CreateQnaDto,
        file: Express.Multer.File,
    ) {
        const { ...restOfQna } = createQnaDto;
        const user = await this.veryfiyUser(userId);

        if (user.userType === "user" && file) {
            const Qna = await this.qnaReporitory.save({
                userId: user.id,
                userName: user.name,
                image: await this.awsService.fileupload(file),
                ...restOfQna,
            });

            return Qna;
        } else if (user.userType === "user" && !file) {
            const Qna = await this.qnaReporitory.save({
                userId: user.id,
                userName: user.name,
                ...restOfQna,
            });

            return Qna;
        } else {
            throw new BadRequestException("QNA는 사용자만 작성할 수 있습니다.");
        }
    }

    async findAllQna() {
        const QnaAll = await this.qnaReporitory.find({
            order: { updatedAt: "DESC" },
        });
        return QnaAll;
    }

    async findOneQna(qnaId: number) {
        const qna = await this.veryfiyQna(qnaId);
        return qna;
    }

    async updateQna(
        userId: number,
        qnaId: number,
        file: Express.Multer.File,
        updateQnaDto: UpdateQnaDto,
    ) {
        const { ...restOfQna } = updateQnaDto;
        await this.veryfiyQna(qnaId);

        const user = await this.veryfiyUser(userId);
        if (user.userType === "user" && file) {
            const qna = await this.qnaReporitory.save({
                id: qnaId,
                image: await this.awsService.fileupload(file),
                ...restOfQna,
            });
            return qna;
        } else if (user.userType === "user" && !file) {
            const qna = await this.qnaReporitory.save({
                id: qnaId,
                ...restOfQna,
            });
            return qna;
        }
    }

    async deleteQna(qnaId: number, userId: number) {
        const qna = await this.veryfiyQna(qnaId);
        const user = await this.veryfiyUser(userId);

        if (user.userType === "user") {
            await this.qnaReporitory.delete({ id: qna.id });

            return qna;
        } else {
            throw new BadRequestException("QNA은 사용자만 삭제할 수 있습니다.");
        }
    }

    private async veryfiyUser(userId: number) {
        const masterUser = await this.userReporitory.findOne({
            where: { id: userId },
        });

        if (!masterUser) {
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        return masterUser;
    }

    private async veryfiyQna(qnaId: number) {
        const qna = await this.qnaReporitory.findOne({
            where: { id: qnaId },
            relations: { qnaComment: true },
        });

        if (!qna) {
            throw new NotFoundException("QNA가 존재하지 않습니다.");
        }
        return qna;
    }
}
