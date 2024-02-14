import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Faq } from "src/entity/faq.entity";
import { Repository } from "typeorm";
import { User } from "src/entity/user.entity";

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(User)
        private readonly userReporitory: Repository<User>,
        @InjectRepository(Faq)
        private readonly faqReporitory: Repository<Faq>,
    ) {}
    async createFaq(userId: number, createFaqDto: CreateFaqDto) {
        const { ...restOfNotice } = createFaqDto;
        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin") {
            const faq = await this.faqReporitory.save({
                userId: admin.id,
                ...restOfNotice,
            });
            return faq;
        } else {
            throw new BadRequestException("FAQ는 관리자만 작성할 수 있습니다.");
        }
    }

    async findAllFaq() {
        const faqAll = await this.faqReporitory.find();
        return faqAll;
    }

    async findOneFaq(faqId: number) {
        const faqFindOne = await this.veryfiyFaq(faqId);

        return faqFindOne;
    }

    async updateFaq(userId: number, faqId: number, updateFaqDto: UpdateFaqDto) {
        const faq = await this.veryfiyFaq(faqId);

        const admin = await this.veryfiyAdmin(userId);

        if (admin.userType === "admin") {
            const { ...restOfFaq } = updateFaqDto;
            const faqUpdate = await this.faqReporitory.save({
                id: faq.id,
                ...restOfFaq,
            });

            return faqUpdate;
        } else {
            throw new BadRequestException("FAQ는 관리자만 수정할 수 있습니다.");
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
