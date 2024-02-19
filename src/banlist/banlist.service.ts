import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./../entity/user.entity";
import { UserType } from "./../entity/user.entity";
import { PenaltyDTO } from "./dto/penalty.dto";
import { ActionType, Banlist } from "./../entity/banlist.entity";
import { LessThan, Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";

const now = new Date();
const utc = now.getTime();
const koreaTimeDiff = 9 * 60 * 60 * 1000;
const korNow = new Date(utc + koreaTimeDiff);
@Injectable()
export class BanlistService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Banlist)
        private banlistRepository: Repository<Banlist>,
    ) {}

    // 신고받은 회원 경고하기
    async warningUser(userId: number, banUserId: number) {
        try {
            await this.checkAdmin(userId);

            const banlist = new Banlist();
            banlist.actionType = ActionType.WARNING;
            banlist.banListUserId = banUserId;

            return await this.banlistRepository.save(banlist);
        } catch (error) {}
    }

    // 신고받은 회원 징계하기
    async penaltyUser(
        userId: number,
        banUserId: number,
        penaltyDTO: PenaltyDTO,
    ) {
        try {
            await this.checkAdmin(userId);

            const banListUser = await this.userRepository.findOne({
                where: {
                    id: banUserId,
                },
            });

            if (!banListUser) {
                throw new NotFoundException("User not found");
            }

            const banlist = new Banlist();
            banlist.actionType = ActionType.PENALTY;
            banlist.banListUser = banListUser;

            banlist.duration = Banlist.setDurationFromNumber(
                penaltyDTO.duration,
            );

            banListUser.userType = UserType.BANNED_USER;

            await Promise.all([
                this.banlistRepository.save(banlist),
                this.userRepository.save(banListUser),
            ]);

            return banlist;
        } catch (error) {}
    }

    // 신고받은 회원 영구징계하기
    async permanentBanUser(userId: number, banUserId: number) {
        try {
            await this.checkAdmin(userId);

            const banListUser = await this.userRepository.findOne({
                where: {
                    id: banUserId,
                },
            });

            if (!banListUser) {
                throw new NotFoundException("User not found");
            }

            const banlist = new Banlist();
            banlist.actionType = ActionType.PERMANENT_BAN;
            banlist.banListUser = banListUser;

            banListUser.userType = UserType.PERMANENT_BAN;

            await Promise.all([
                this.banlistRepository.save(banlist),
                this.userRepository.save(banListUser),
            ]);

            return banlist;
        } catch (error) {}
    }

    // 유저아이디를 통한 벤리스트 조회하기
    async getBanList(userId: number, banUserId: number) {
        try {
            await this.checkAdmin(userId);

            return await this.userRepository.findOne({
                where: {
                    id: banUserId,
                },
                relations: {
                    banList: true,
                },
            });
        } catch (error) {
            // Handle errors here
        }
    }

    // 징계 취소하기
    async cancelBan(userId: number, banListId: number) {
        try {
            await this.checkAdmin(userId);

            const banlist = await this.banlistRepository.findOne({
                where: {
                    id: banListId,
                },
                relations: {
                    banListUser: true,
                },
            });

            if (!banlist) {
                throw new NotFoundException("없는 벤리스트입니다.");
            }

            const user = banlist.banListUser;

            user.userType = UserType.USER;

            return await Promise.all([
                this.banlistRepository.remove(banlist),
                this.userRepository.save(user),
            ]);
        } catch (error) {
            throw new Error(error);
        }
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

    //징계기간이 지나면 삭제되는 로직
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkPenaltyExpiration() {
        const currentDate = new Date();
        const banLists = await this.banlistRepository.find({
            where: {
                duration: LessThan(currentDate),
            },
        });

        for (const banList of banLists) {
            await this.banlistRepository.remove(banList);
        }
    }
}
