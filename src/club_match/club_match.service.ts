import { UserId } from "./../auth/decorators/userId.decorator";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckClubMatchDTO, ClubMatchDTO } from "./dto/club_match.dto";
import { ClubMatch } from "../entity/club_match.entity";
import { Club } from "../entity/club.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundError } from "rxjs";
import { ClubMatchStatus } from "../entity/club_match.entity";
import { MatchStatus } from "src/entity/match.entity";

@Injectable()
export class ClubMatchService {
    constructor(
        @InjectRepository(ClubMatch)
        private clubMatchRepository: Repository<ClubMatch>,
        @InjectRepository(Club)
        private clubRepository: Repository<Club>,
    ) {}
    //매치 신청하기

    async postClubMatch(
        id: number,
        userId: number,
        clubMatchDTO: ClubMatchDTO,
    ) {
        const guestClub = await this.clubRepository.findOne({
            where: {
                masterId: userId,
            },
        });

        if (!guestClub) {
            throw new NotFoundException(
                "동아리가 없거나 동아리장만 신청할 수 있습니다.",
            );
        }

        const hostClub = await this.clubRepository.findOne({
            where: {
                id: id,
            },
        });

        const newMatch = this.clubMatchRepository.create({
            host_clubId: id,
            host_clubId_master: hostClub.masterId,
            host_club_name: hostClub.name,
            guest_clubId: guestClub.id,
            guest_clubId_master: userId,
            guest_club_name: guestClub.name,
            ...clubMatchDTO,
        });

        return await this.clubMatchRepository.save(newMatch);
    }

    //host매치 조회하기
    async getHostMatch(userId: number) {
        const matches = await this.clubMatchRepository.find({
            where: {
                host_clubId_master: userId,
            },
            select: {
                id: true,
                host_club_name: true,
                guest_club_name: true,
                message: true,
                Information: true,
                status: true,
            },
        });

        return matches;
    }

    //호스트 매치 상세조회
    async findHostMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                host_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        return match;
    }

    //host매치 승인/거절하기
    async putHostMatch(
        id: number,
        userId: number,
        checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        console.log(userId);
        console.log(id);
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                host_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        if (match.status === ClubMatchStatus.CANCEL) {
            throw new NotFoundException("취소된 경기입니다.");
        }

        if (checkClubMatchDTO.status === ClubMatchStatus.CANCEL) {
            throw new NotFoundException("호스트는 취소할 수 없습니다.");
        }

        match.status = checkClubMatchDTO.status;

        await this.clubMatchRepository.save(match);
    }

    //guest매치 조회하기
    async getGuestMatch(userId: number) {
        const matches = await this.clubMatchRepository.find({
            where: {
                guest_clubId_master: userId,
            },
            select: {
                id: true,
                guest_club_name: true,
                host_club_name: true,
                message: true,
                Information: true,
                status: true,
            },
        });

        return matches;
    }

    //guest매치 상세조회
    async findGuestMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                guest_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        return match;
    }

    //게스트 매치 취소하기
    async cancelGuestMatch(
        id: number,
        userId: number,
        checkClubMatchDTO: CheckClubMatchDTO,
    ) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
                guest_clubId_master: userId,
            },
        });

        if (!match) {
            throw new NotFoundException(`매치 ${id}을 찾을 수 없습니다.`);
        }

        if (
            checkClubMatchDTO.status === ClubMatchStatus.APPROVED ||
            checkClubMatchDTO.status === ClubMatchStatus.REJECTED
        ) {
            throw new NotFoundException("게스트는 승인/거절 할 수 없습니다.");
        }

        match.status = ClubMatchStatus.CANCEL;

        return await this.clubMatchRepository.save(match);
    }

    //삭제하기
    async deleteClubMatch(id: number, userId: number) {
        const match = await this.clubMatchRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!match) {
            throw new NotFoundException(`Match ${id}을 찾을 수 없습니다.`);
        }

        if (
            match.guest_clubId_master !== userId &&
            match.host_clubId_master !== userId
        ) {
            throw new NotFoundException("권한이 없습니다.");
        }

        if (match.status !== ClubMatchStatus.CANCEL) {
            throw new NotFoundException("취소되지 않은 경기입니다.");
        }

        return await this.clubMatchRepository.remove(match);
    }
}
