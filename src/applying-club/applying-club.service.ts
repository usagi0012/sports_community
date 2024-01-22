import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClubApplication } from "src/entity/club-application.entity";
import { Repository } from "typeorm";
import { ApplicationDto } from "./dto/application.dto";
import { Club } from "src/entity/club.entity";
import { User } from "src/entity/user.entity";
import { PermissionApplicationDto } from "./dto/permission-application.dto";
import { ApplicationReviewDto } from "./dto/applicationReview.dto";
import { ClubApplicationStatus } from "../entity/club-application.entity";
import { Alarmservice } from "../alarm/alarm.service";

@Injectable()
export class ApplyingClubService {
    constructor(
        @InjectRepository(ClubApplication)
        private readonly clubApplicationRepository: Repository<ClubApplication>,
        @InjectRepository(Club)
        private readonly ClubRepository: Repository<Club>,
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        private readonly alramService: Alarmservice,
    ) {}

    // 동호회 신청서 생성
    async postApplyingClub(applicationDto: ApplicationDto, userId: number) {
        const { message, clubId } = applicationDto;

        // 이미 지원했을 경우 에러 발생
        const existApplication = await this.clubApplicationRepository.findOne({
            where: { userId },
        });
        if (existApplication) {
            throw new BadRequestException("지원서 신청은 한 곳만 가능합니다.");
        }

        // 가입하려는 동호회가 없을 경우 에러 발생
        const club = await this.ClubRepository.findOne({
            where: { id: clubId },
        });

        if (!club) {
            throw new NotFoundException(
                "가입하려는 동호회가 존재하지 않습니다.",
            );
        }

        // 이미 가입된 동호회가 있을 경우 에러 발생
        const user = await this.UserRepository.findOne({
            where: { id: userId },
        });
        if (user.clubId) {
            throw new BadRequestException("이미 가입된 동호회가 존재합니다.");
        }

        // 모집정원 초과시 에러 발생 같은 것 만들면 좋을 듯.(모집 정원이라는 것도 만들면 좋을 것 같음)

        const application = await this.clubApplicationRepository.save({
            userId,
            clubId,
            message,
        });

        return application;
    }

    // 내 신청서 조회
    async getApplyingClub(userId) {
        const application = await this.findApplicationByUserId(userId);

        return application;
    }

    // 내 신청서 수정
    async updateApplyingClub(
        permissionApplicationDto: PermissionApplicationDto,
        userId: number,
        clubId: number,
    ) {
        const { message } = permissionApplicationDto;

        const isApplication = await this.clubApplicationRepository.findOne({
            where: { userId, clubId },
        });

        if (!isApplication) {
            throw new NotFoundException(
                "해당 동호회에 대한 내 신청서가 존재하지 않습니다.",
            );
        }
        const application = await this.findApplicationByUserId(userId);
        const applicationId = application.id;
        const updatedApplication = await this.clubApplicationRepository.update(
            applicationId,
            { message },
        );

        return updatedApplication;
    }

    // 내 신청서 삭제
    async deleteApplyingClub(userId) {
        await this.findApplicationByUserId(userId);

        const deletedApplication = await this.clubApplicationRepository.delete({
            userId,
        });

        return deletedApplication;
    }

    //userId값으로 동호회 지원서 찾기
    async findApplicationByUserId(userId) {
        const application = await this.clubApplicationRepository.findOne({
            where: { userId },
        });

        if (!application) {
            throw new NotFoundException("존재하지 않는 지원서입니다.");
        }

        return application;
    }

    async getApplicationOfMyClub(clubId: number, userId: number) {
        // 동호회 장이 아니면 열람 불가
        const club = await this.ClubRepository.findOne({
            where: { id: clubId },
        });
        if (club.masterId !== userId) {
            throw new ForbiddenException("동호회 장만 조회할 수 있습니다.");
        }

        const application = await this.clubApplicationRepository.find({
            where: { clubId },
        });

        return application;
    }

    async reviewApplication(
        applicationReviewDto: ApplicationReviewDto,
        userId: number,
        clubId: number,
        memberId: number,
    ) {
        const { permission } = applicationReviewDto;
        console.log("permission", typeof permission);

        const club = await this.ClubRepository.findOne({
            where: { id: clubId },
        });

        if (club.masterId !== userId) {
            throw new ForbiddenException(
                "동아리 장만 승인/거절할 수 있습니다.",
            );
        }

        if (!permission) {
            // 승인을 거부했을 때의 로직.
            // 동호회 신청서 삭제(해야하나? status를 만든 의미가 없는 것 같은데 그럼) - 한 번 물어보기.
            // 동호회 신청 거절 알림
            const message = `${club.name}동호회 가입 신청이 거부되었습니다.`;
            await this.alramService.sendAlarm(memberId, message);
        }

        // 요청한 신청서 찾기
        const userApplication = await this.clubApplicationRepository.findOne({
            where: { userId: memberId, clubId },
        });
        const applicationId = userApplication.id;

        // 요청 승인시 신청서의 상태 -> "요청 승인"
        const updatedApplication = await this.clubApplicationRepository.update(
            applicationId,
            { status: ClubApplicationStatus.APPROVED }, // 이 부분 수정 필요
        );

        const application = await this.clubApplicationRepository.findOne({
            where: { id: applicationId },
        });

        // 요청 승인시 user의 clubId를 승인한 club의 아이디로 변경
        const joinedUser = await this.UserRepository.update(memberId, {
            clubId,
        });

        // 요청 승인시 지원서를 작성한 user에게 알림 보내기
        // 알림 보내기 로직

        const message = `${club.name}동호회 가입 신청이 승인되었습니다.`;
        await this.alramService.sendAlarm(memberId, message);

        return joinedUser;
    }
}
