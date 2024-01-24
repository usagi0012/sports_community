import { Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
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

    //벤 신청하기
    async benUser(userId: number, benUserId: number, reportDTO: ReportDTO) {
        try {
            const report = new Report();
            report.reportContent = reportDTO.reportContent;
            report.benUserId = benUserId;
            report.reportUserId = userId;

            return await this.reportRepository.save(report);
        } catch (error) {}
    }
    //본인이 신청한 벤 조회하기
    async getMyBen(userId: number) {
        const myBens = await this.reportRepository.find({
            where: {
                reportUserId: userId,
            },
        });

        return myBens;
    }

    //마이벤 상세조회
    async findMyBen(userId: number, reportId: number) {
        const ben = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
            relations: ["reportUser", "benUser"],
        });

        if (!ben) {
            throw new NotFoundException("Report not found");
        }

        return ben;
    }

    //APPROVE/CANCEL된 리포트 컴펌하여 삭제하기
    async confirmBen(userId: number, reportId: number) {
        const ben = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
        });

        if (!ben) {
            throw new NotFoundException("Report not found");
        }

        if (ben.progress === Progress.EVALUATION_COMPLETED) {
            throw new NotFoundException("신고 진행 중입니다.");
        }
        return await this.reportRepository.remove(ben);
    }

    //그냥 취소하고 삭제하기
    async deleteBen(userId: number, reportId: number) {
        const ben = await this.reportRepository.findOne({
            where: {
                id: reportId,
                reportUserId: userId,
            },
        });

        if (!ben) {
            throw new NotFoundException("Report not found");
        }

        return await this.reportRepository.remove(ben);
    }

    //어드민 벤 명단보기
    async getBen(userId: number) {
        await this.checkAdmin(userId);

        const bens = await this.reportRepository.find({
            where: {
                progress: Progress.EVALUATION_COMPLETED,
            },
            select: ["id", "reportUserId", "reportContent", "benUserId"],
        });

        return bens;
    }

    //어드민 벤 상세 명단보기
    async findBen(userId: number, reportId: number) {
        await this.checkAdmin(userId);
        const ben = await this.reportRepository.findOne({
            where: { id: reportId },
            relations: ["reportUser", "benUser"],
        });

        console.log(ben);
        if (!ben) {
            throw new NotFoundException("Report not found");
        }
        return ben;
    }

    //어드민 벤 승인 거절
    async processBen(
        userId: number,
        reportId: number,
        reportProcessDTO: ReportProcessDTO,
    ) {
        await this.checkAdmin(userId);

        const ben = await this.reportRepository.findOne({
            where: {
                id: reportId,
            },
        });

        if (!ben) {
            throw new NotFoundException("Report not found");
        }

        ben.progress = reportProcessDTO.progress;

        return await this.reportRepository.save(ben);
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
