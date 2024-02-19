import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportDTO } from "./dto/report.dto";
import { User } from "./../entity/user.entity";
import { UserType } from "./../entity/user.entity";
import { Progress, Report } from "./../entity/report.entity";
import { ReportProcessDTO } from "./dto/process.report.dto";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,
    ) {}

    //벤 유저 조회하기
    async getBanUser(userId: number, banUserId: number) {
        try {
            const banUser = await this.userRepository.findOne({
                where: {
                    id: banUserId,
                },
            });

            const me = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

            return { banUser, me };
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //벤 신청하기
    async banUser(userId: number, banUserId: number, reportDTO: ReportDTO) {
        try {
            const BanUser = await this.userRepository.findOne({
                where: {
                    id: banUserId,
                },
            });

            const User = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            const report = new Report();
            report.title = reportDTO.title;
            report.reportContent = reportDTO.reportContent;
            report.banUserId = banUserId;
            report.reportUserId = userId;
            report.banUserName = BanUser.name;
            report.reportUserName = User.name;

            return await this.reportRepository.save(report);
        } catch (error) {}
    }
    //본인이 신청한 벤 조회하기
    async getMyBan(userId: number) {
        const myBans = await this.reportRepository.find({
            where: {
                reportUserId: userId,
            },
        });

        return myBans;
    }

    //마이벤 상세조회
    async findMyBan(userId: number, reportId: number) {
        const ban = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
            relations: ["reportUser", "banUser"],
        });

        if (!ban) {
            throw new NotFoundException("Report not found");
        }

        return ban;
    }

    //APPROVE/CANCEL된 리포트 컴펌하여 삭제하기
    async confirmBan(userId: number, reportId: number) {
        const ban = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
        });

        if (!ban) {
            throw new NotFoundException("Report not found");
        }

        if (ban.progress === Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException("신고 진행 중입니다.");
        }

        return await this.reportRepository.remove(ban);
    }

    //그냥 취소하고 삭제하기
    async deleteBan(userId: number, reportId: number) {
        const ban = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
        });

        if (!ban) {
            throw new NotFoundException("Report not found");
        }

        return await this.reportRepository.remove(ban);
    }

    //어드민 벤 명단보기
    async getBan(userId: number) {
        await this.checkAdmin(userId);

        const bans = await this.reportRepository.find({
            where: {
                progress: Progress.EVALUATION_COMPLETED,
            },
        });

        return bans;
    }

    //어드민 벤 상세 명단보기
    async findBan(userId: number, reportId: number) {
        await this.checkAdmin(userId);
        const ban = await this.reportRepository.findOne({
            where: { id: reportId },
            relations: ["reportUser", "banUser"],
        });

        if (!ban) {
            throw new NotFoundException("Report not found");
        }
        return ban;
    }

    //어드민 벤 승인 거절
    async processBan(
        userId: number,
        reportId: number,
        reportProcessDTO: ReportProcessDTO,
    ) {
        await this.checkAdmin(userId);

        const ban = await this.reportRepository.findOne({
            where: {
                id: reportId,
            },
        });

        if (!ban) {
            throw new NotFoundException("Report not found");
        }

        ban.progress = reportProcessDTO.progress;

        return await this.reportRepository.save(ban);
    }

    //어드민 확인
    private async checkAdmin(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user || user.userType !== UserType.ADMIN) {
            throw new NotFoundException("NOT ADMIN");
        }
    }
}
