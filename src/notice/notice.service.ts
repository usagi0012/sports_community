import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { UpdateNoticeDto } from "./dto/update-notice.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "src/entity/notice.entity";
import { Repository } from "typeorm";
import { User } from "src/entity/user.entity";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(User)
        private readonly userReporitory: Repository<User>,
        @InjectRepository(Notice)
        private readonly noticeReporitory: Repository<Notice>,
    ) {}
    async createNotice(userId: number, createNoticeDto: CreateNoticeDto) {
        const { ...restOfNotice } = createNoticeDto;
        const adminUser = await this.veryfiyAdmin(userId);

        if (adminUser.userType === "admin") {
            const notice = await this.noticeReporitory.save({
                userId: adminUser.id,
                ...restOfNotice,
            });

            return notice;
        } else {
            throw new BadRequestException("관리자만 작성할 수 있습니다.");
        }
    }

    async findAllNotice() {
        const noticeAll = await this.noticeReporitory.find();
        return noticeAll;
    }

    async findOneNotice(noticeId: number) {
        const notice = await this.veryfiyNotice(noticeId);
        return notice;
    }

    async updateNotice(
        userId: number,
        noticeId: number,
        updateNoticeDto: UpdateNoticeDto,
    ) {
        const notice = await this.veryfiyNotice(noticeId);

        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin") {
            const { ...restOfNotice } = updateNoticeDto;
            const noticeUpdate = await this.noticeReporitory.save({
                id: notice.id,
                ...restOfNotice,
            });
            return noticeUpdate;
        } else {
            throw new BadRequestException(
                "공지사항은 관리자만 수정할 수 있습니다.",
            );
        }
    }

    async deleteNotice(noticeId: number, userId: number) {
        const notice = await this.veryfiyNotice(noticeId);

        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin") {
            await this.noticeReporitory.delete({ id: notice.id });

            return notice;
        } else {
            throw new BadRequestException(
                "공지사항은 관리자만 삭제할 수 있습니다.",
            );
        }
    }

    private async veryfiyNotice(noticeId: number) {
        const notice = await this.noticeReporitory.findOne({
            where: { id: noticeId },
        });
        if (!notice) {
            throw new NotFoundException("해당 공지글이 존재하지 않습니다.");
        }
        return notice;
    }

    private async veryfiyAdmin(userId: number) {
        const admin = await this.userReporitory.findOne({
            where: { id: userId },
        });

        if (!admin) {
            throw new NotFoundException("해당 사용자는 존재하지 않습니다.");
        }

        return admin;
    }
}
