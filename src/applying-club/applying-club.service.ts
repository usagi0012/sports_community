import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClubApplication } from "src/entity/club-application.entity";
import { Repository } from "typeorm";
import { ApplicationDto } from "./dto/application.dto";
import { Club } from "src/entity/club.entity";

@Injectable()
export class ApplyingClubService {
    constructor(
        @InjectRepository(ClubApplication)
        private readonly clubApplicationRepository: Repository<ClubApplication>,
        @InjectRepository(Club)
        private readonly ClubRepository: Repository<Club>,
        //user-club 레퍼지토리 생성하기
    ) {}

    // 동호회 지원서 생성
    async postApplyingClub(applicationDto: ApplicationDto, userId: number) {
        const { message, clubId } = applicationDto;

        // 이미 지원했을 경우 에러 발생
        const existApplication = await this.clubApplicationRepository.findOne({
            where: { userId },
        });
        if (existApplication) {
            throw new BadRequestException("지원서 신청은 한 곳만 가능합니다.");
        }

        // 이미 가입된 동호회가 있을 경우 에러 발생
        const registeredUser = await this.userClubRepository.findOne({
            where: { userId },
        });
        if (registeredUser) {
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

    // 동호회 지원서 조회
    async getApplyingClub(userId) {
        const application = await this.findApplicationByUserId(userId);

        return application;
    }

    // 동호회 지원서 수정
    async updateApplyingClub(applicationDto: ApplicationDto, userId) {
        const { message, clubId } = applicationDto;
        await this.findApplicationByUserId(userId);

        // 여기에 userId 넣어도 되나? 테이블의 primary key 안 넣어도 되나?
        // userId가 unique값이라 넣어보긴 함. 테스트해보기
        const updatedApplication = await this.clubApplicationRepository.update(
            userId,
            { message },
        );

        return updatedApplication;
    }

    // 동호회 지원서 삭제
    async deleteApplyingClub(userId) {
        await this.findApplicationByUserId(userId);

        // 이것도 보통 테이블 primary key: 키값 넣어야 하는데 update와 마찬가지로 작성함
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
}
