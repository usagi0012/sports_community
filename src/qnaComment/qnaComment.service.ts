import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateQnaCommentDto } from "./dto/createQnaComment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { QnaComment } from "src/entity/qnaComment.entity";
import { UpdateQnaCommentDto } from "./dto/updateQnaComment.dto";
import { Qna } from "src/entity/qna.entity";

@Injectable()
export class QnaCommentService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(QnaComment)
        private readonly qnaCommentRepository: Repository<QnaComment>,
        @InjectRepository(Qna)
        private readonly qnaRepository: Repository<Qna>,
    ) {}

    async createQnaComment(
        userId: number,
        qnaId: number,
        createQnaCommentDto: CreateQnaCommentDto,
    ) {
        const { ...restOfQnaComment } = createQnaCommentDto;

        const admin = await this.veryfiyAdmin(userId);

        const qna = await this.veryfiyQna(qnaId);

        if (admin.userType === "admin") {
            const qnaComment = await this.qnaCommentRepository.save({
                masterId: admin.id,
                qnaId: qnaId,
                masterName: admin.name,
                ...restOfQnaComment,
            });

            return qnaComment;
        } else {
            throw new BadRequestException(
                "QNA 댓글은 관리자만 작성할 수 있습니다.",
            );
        }
    }

    async findAllQnaComment(qnaId: number) {
        await this.veryfiyQna(qnaId);

        const qnaComments = await this.qnaCommentRepository.find({
            where: { qnaId: qnaId },
            order: { createAt: "DESC" },
        });

        return qnaComments;
    }

    async updateQnaComment(
        userId: number,
        qnaId: number,
        qnaCommentId: number,
        updateQnaCommentDto: UpdateQnaCommentDto,
    ) {
        const admin = await this.veryfiyAdmin(userId);

        await this.veryfiyQna(qnaId);

        await this.veryfiyQnaComment(qnaCommentId);
        const { ...restOfQnaComment } = updateQnaCommentDto;
        if (admin.userType === "admin") {
            const updateQnaComment = await this.qnaCommentRepository.save({
                id: qnaCommentId,
                ...restOfQnaComment,
            });
            return updateQnaComment;
        } else {
            throw new BadRequestException(
                "QNA 댓글은 관리자만 작성할 수 있습니다.",
            );
        }
    }

    async deleteQnaComment(
        userId: number,
        qnaId: number,
        qnaCommentId: number,
    ) {
        const admin = await this.veryfiyAdmin(userId);

        await this.veryfiyQna(qnaId);

        const qnaComment = await this.veryfiyQnaComment(qnaCommentId);
        if (admin.userType === "admin") {
            await this.qnaCommentRepository.delete({
                id: qnaCommentId,
                qnaId: qnaId,
            });

            return qnaComment;
        } else {
            throw new BadRequestException(
                "QNA 댓글은 관라지만 삭제할 수 있습니다.",
            );
        }
    }

    private async veryfiyAdmin(userId: number) {
        const admin = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!admin) {
            throw new NotFoundException("해당 사용자는 존재하지 않습니다.");
        }
        return admin;
    }

    private async veryfiyQnaComment(qnaCommentId: number) {
        const qnaComment = await this.qnaCommentRepository.findOne({
            where: { id: qnaCommentId },
        });

        if (!qnaComment) {
            throw new NotFoundException("해당 QNA 댓글은 존재하지 않습니다.");
        }

        return qnaComment;
    }

    private async veryfiyQna(qnaId: number) {
        const qna = await this.qnaRepository.findOne({
            where: { id: qnaId },
        });

        if (!qna) {
            throw new NotFoundException("해당 QNA 게시물지 존재하지 않습니다.");
        }
        return qna;
    }

    async verifyAdmin(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("해당하는 유저가 없습니다.");
        }
        if (user.userType === "user") {
            throw new UnauthorizedException("권한이 없는 유저입니다.");
        }

        return user;
    }
}
