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
import { UserProfile } from "src/entity/user-profile.entity";

@Injectable()
export class ApplyingClubService {
    constructor(
        @InjectRepository(ClubApplication)
        private readonly clubApplicationRepository: Repository<ClubApplication>,
        @InjectRepository(Club)
        private readonly ClubRepository: Repository<Club>,
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        private readonly alramService: Alarmservice,
    ) {}

    // 동호회 신청서 생성
    async postApplyingClub(
        permissionApplicationDto: PermissionApplicationDto,
        userId: number,
        clubId: number,
    ) {
        const { message } = permissionApplicationDto;

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

        this.alramService.sendAlarm(
            club.masterId,
            `동호회 신청이 들어왔습니다.
            지원 이유 : ${message}`,
        );
        return application;
    }

    // 내 신청서 조회
    async getApplyingClub(userId) {
        const application = await this.findApplicationByUserId(userId);

        const club = await this.ClubRepository.findOne({
            where: { id: application.clubId },
        });
        const clubName = club.name;

        const result = { ...application, clubName };

        return result;
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
            throw new NotFoundException("지원서가 존재하지 않습니다.");
        }

        return application;
    }

    async getApplicationOfMyClub(userId: number) {
        // 동호회 장이 아니면 열람 불가
        const user = await this.UserRepository.findOne({
            where: { id: userId },
        });
        const clubId = user.clubId;

        const club = await this.ClubRepository.findOne({
            where: { id: clubId },
        });
        if (club.masterId !== userId) {
            throw new ForbiddenException("동호회 장만 조회할 수 있습니다.");
        }

        const applications = await this.clubApplicationRepository.find({
            where: { clubId },
        });
        console.log("지원자들", applications);

        const nicknames = await Promise.all(
            applications.map(async (app) => {
                const userProfile = await this.userProfileRepository.findOne({
                    where: { userId: app.userId },
                });
                console.log("앱 유저아이디", app.userId);
                console.log("유저 프로필", userProfile);
                if (!userProfile) {
                    const userName = user.name;
                    return userName;
                }
                const userName = userProfile.nickname;
                return userName;
            }),
        );

        return { applications, nicknames };
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
        // 요청한 신청서 찾기
        const userApplication = await this.clubApplicationRepository.findOne({
            where: { userId: memberId, clubId },
        });
        const applicationId = userApplication.id;

        console.log("permission", permission);
        if (!permission) {
            // 승인을 거부했을 때의 로직.
            // 동호회 신청서 삭제(해야하나? status를 만든 의미가 없는 것 같은데 그럼) - 한 번 물어보기.
            // 동호회 신청 거절 알림
            const deletedApplication =
                await this.clubApplicationRepository.delete({
                    userId: memberId,
                    clubId,
                });
            console.log(deletedApplication);

            const message = `${club.name}동호회 가입 신청이 거부되었습니다.`;
            // await this.alramService.sendAlarm(memberId, message);

            await this.clubApplicationRepository.update(applicationId, {
                status: ClubApplicationStatus.REJECTED,
            });
            throw new Error("신청이 거절되었습니다.");
        }

        // 멤버가 이미 가입된 동아리가 있을 경우 에러처리
        // (신청서에서는 못보내지만 동아리 생성시 clubId 생기기 때문)
        const isJoinedMember = await this.UserRepository.findOne({
            where: { id: memberId },
        });
        console.log("조인 멤버 클럽아이디", isJoinedMember.clubId);
        if (isJoinedMember.clubId) {
            await this.clubApplicationRepository.update(applicationId, {
                status: ClubApplicationStatus.REJECTED,
            });
            const deletedApplication =
                await this.clubApplicationRepository.delete({
                    userId: memberId,
                    clubId,
                });
            console.log(deletedApplication);
            throw new Error(
                "신청자가 가입된 동호회가 있어 승인할 수 없습니다.",
            );
        }

        // 요청 승인시 신청서의 상태 -> "요청 승인"
        const updatedApplication = await this.clubApplicationRepository.update(
            applicationId,
            { status: ClubApplicationStatus.APPROVED },
        );

        const application = await this.clubApplicationRepository.findOne({
            where: { id: applicationId },
        });

        // 요청 승인시 user의 clubId를 승인한 club의 아이디로 변경
        const joinedUser = await this.UserRepository.update(memberId, {
            clubId,
        });

        // 요청 승인시 club의 member를 1 늘리기
        const addMember = club.members + 1;

        await this.ClubRepository.update(clubId, {
            members: addMember,
        });
        // 요청 승인시 지원서 삭제
        const deletedApplication = await this.clubApplicationRepository.delete({
            userId: memberId,
            clubId,
        });
        console.log(deletedApplication);
        // 요청 승인시 지원서를 작성한 user에게 알림 보내기
        // 알림 보내기 로직

        const message = `${club.name}동호회 가입 신청이 승인되었습니다.`;
        this.alramService.sendAlarm(memberId, message);

        return joinedUser;
    }

    async isClubMaster(userId: number) {
        const isMaster = await this.ClubRepository.findOne({
            where: { masterId: userId },
        });

        if (!isMaster) {
            throw new NotFoundException("동호회장이 아닙니다.");
        }
        return isMaster;
    }
}
