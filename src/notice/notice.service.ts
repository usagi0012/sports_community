import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateNoticeDto } from "./dto/createNotice.dto";
import { UpdateNoticeDto } from "./dto/updateNotice.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "src/entity/notice.entity";
import { Repository } from "typeorm";
import { User } from "src/entity/user.entity";
import { AwsService } from "src/aws/aws.service";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Notice)
        private readonly noticeReporitory: Repository<Notice>,
        private readonly awsService: AwsService,
    ) {}
    async createNotice(
        userId: number,
        file: Express.Multer.File,
        createNoticeDto: CreateNoticeDto,
    ) {
        const { ...restOfNotice } = createNoticeDto;
        const adminUser = await this.veryfiyAdmin(userId);

        if (file) {
            const faq = await this.noticeReporitory.save({
                masterId: adminUser.id,
                masterName: adminUser.name,
                image: await this.awsService.fileupload(file),
                ...restOfNotice,
            });
            return faq;
        } else if (!file) {
            const faq = await this.noticeReporitory.save({
                masterId: adminUser.id,
                masterName: adminUser.name,
                ...restOfNotice,
            });
            return faq;
        } else {
            throw new BadRequestException(
                "예상치 못한 오류가 발생하였습니다. 다시 시도해주세요.",
            );
        }
    }

    async findAllNotice() {
        const noticeAll = await this.noticeReporitory.find({
            order: { updatedAt: "DESC" },
        });
        return noticeAll;
    }

    async findOneNotice(noticeId: number) {
        const notice = await this.veryfiyNotice(noticeId);
        return notice;
    }

    async updateNotice(
        userId: number,
        noticeId: number,
        file: Express.Multer.File,
        updateNoticeDto: UpdateNoticeDto,
    ) {
        const { ...restOfNotice } = updateNoticeDto;
        await this.veryfiyNotice(noticeId);

        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin" && file) {
            const faq = await this.noticeReporitory.save({
                id: noticeId,
                image: await this.awsService.fileupload(file),
                ...restOfNotice,
            });
            return faq;
        } else if (admin.userType === "admin" && !file) {
            const faq = await this.noticeReporitory.save({
                id: noticeId,
                ...restOfNotice,
            });
            return faq;
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
        const admin = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!admin) {
            throw new NotFoundException("해당 사용자는 존재하지 않습니다.");
        }

        return admin;
    }

    async verifyAdmin(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("해당하는 유저가 없습니다.");
        }
        if (user.userType !== "admin") {
            throw new UnauthorizedException("관리 권한이 없는 유저입니다.");
        }

        return user;
    }
}
