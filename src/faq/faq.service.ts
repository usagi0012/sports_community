import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Faq } from "src/entity/faq.entity";
import { Repository } from "typeorm";
import { User } from "src/entity/user.entity";
import { AwsService } from "src/aws/aws.service";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { UpdateFaqDto } from "./dto/updateFaq.dto";

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(User)
        private readonly userReporitory: Repository<User>,
        @InjectRepository(Faq)
        private readonly faqReporitory: Repository<Faq>,
        private readonly awsService: AwsService,
    ) {}
    async createFaq(
        userId: number,
        file: Express.Multer.File,
        createFaqDto: CreateFaqDto,
    ) {
        const { ...restOfNotice } = createFaqDto;
        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin" && file) {
            const faq = await this.faqReporitory.save({
                masterId: admin.id,
                masterName: admin.name,
                image: await this.awsService.fileupload(file),
                ...restOfNotice,
            });
            return faq;
        } else if (admin.userType === "admin" && !file) {
            const faq = await this.faqReporitory.save({
                masterId: admin.id,
                masterName: admin.name,
                ...restOfNotice,
            });
            return faq;
        } else {
            throw new BadRequestException("FAQ는 관리자만 작성할 수 있습니다.");
        }
    }

    async findAllFaq() {
        const faqAll = await this.faqReporitory.find({
            order: { updatedAt: "DESC" },
        });
        return faqAll;
    }

    async findOneFaq(faqId: number) {
        const faqFindOne = await this.veryfiyFaq(faqId);

        return faqFindOne;
    }

    async updateFaq(
        userId: number,
        faqId: number,
        file: Express.Multer.File,
        updateFaqDto: UpdateFaqDto,
    ) {
        await this.veryfiyFaq(faqId);

        const admin = await this.veryfiyAdmin(userId);

        const { ...restOfNotice } = updateFaqDto;

        if (admin.userType === "admin" && file) {
            const faq = await this.faqReporitory.save({
                id: faqId,
                image: await this.awsService.fileupload(file),
                ...restOfNotice,
            });
            return faq;
        } else if (admin.userType === "admin" && !file) {
            const faq = await this.faqReporitory.save({
                id: faqId,
                ...restOfNotice,
            });
            return faq;
        } else {
            throw new BadRequestException("FAQ는 관리자만 작성할 수 있습니다.");
        }
    }

    async deleteFaq(userId: number, faqId: number) {
        const faq = await this.veryfiyFaq(faqId);
        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin") {
            await this.faqReporitory.delete({ id: faq.id });
            return faq;
        } else {
            throw new BadRequestException("FAQ는 관리자만 삭제할 수 있습니다.");
        }
    }

    private async veryfiyFaq(faqId: number) {
        const faq = await this.faqReporitory.findOne({ where: { id: faqId } });
        if (!faq) {
            throw new NotFoundException("해당하는 FAQ가 존재하지 않습니다.");
        }
        return faq;
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
