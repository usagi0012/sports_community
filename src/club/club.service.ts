import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Club } from "../entity/club.entity";
import { UserService } from "../user/user.service";
import { FindManyOptions, FindOptions, Repository } from "typeorm";
import { CreateClubDto } from "./dto/createClub.dto";
import { UpdateClubDto } from "./dto/updateClub.dto";
import { AwsService } from "../aws/aws.service";
import { User } from "src/entity/user.entity";
import { ExpelMemberDto } from "./dto/expelMember.dto";
import { UserProfile } from "src/entity/user-profile.entity";

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        private readonly userService: UserService,
        private readonly awsService: AwsService,
    ) {}

    // take랑 skip 배분을 잘 해줘야 값이 뜨ㅡ네;;
    async getAllClubs(sortBy, region, page: number, itemsPerPage: number = 30) {
        const skip = (page - 1) * itemsPerPage;
        console.log("region***", region);

        let clubs;
        let total;
        let findOption: FindManyOptions<Club> = {
            select: ["id", "name", "region", "masterId", "score", "createdAt"],
            relations: ["users"],
            take: 30,
            skip: 0,
        };
        switch (sortBy) {
            case "region":
                findOption = { ...findOption, where: { region } };
                break;
            case "latest":
                findOption = { ...findOption, order: { createdAt: "desc" } };
                break;
            case "score":
                findOption = { ...findOption, order: { score: "desc" } };
                break;
        }
        // 조건에 맞게 조회하기(순서, 지역)
        [clubs, total] = await this.clubRepository.findAndCount(findOption);
        console.log("clubs", clubs);

        // const clubsWithMasterNames = await Promise.all(
        //     clubs.map(async (club) => {
        //         const master = club.users.find(
        //             (user) => user.id === club.masterId,
        //         );
        //         console.log("===master===", master);
        //         return {
        //             ...club,
        //             masterName: master ? master.name : null,
        //         };
        //     }),
        // );

        const clubsWithNickName = await Promise.all(
            clubs.map(async (club) => {
                const userInfo = await this.userProfileRepository.findOne({
                    where: { userId: club.masterId },
                });
                // 유저 이름 가져오기(마스터이름)
                const user = await this.userRepository.findOne({
                    where: { id: club.masterId },
                });
                const userName = user.name;
                if (!userInfo) {
                    return { ...club, userName };
                }
                const nickName = userInfo.nickname;
                const result = { ...club, nickName, userName };

                return result;
            }),
        );

        return {
            data: clubsWithNickName,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / 30),
            },
        };
    }

    async getClub(id: number) {
        const club = await this.clubRepository.findOne({
            where: { id },
            relations: { users: true },
            select: [],
        });

        return club;
    }

    async createClub(
        createClubDto: CreateClubDto,
        userId: number,
        file: Express.Multer.File,
    ) {
        const { name, region, description } = createClubDto;
        const user = await this.userService.findUserById(userId);
        const existClub = await this.clubRepository.findOne({
            where: { name },
        });
        console.log(existClub);
        if (user.clubId) {
            throw new ConflictException("동아리는 하나만 가입할 수 있습니다.");
        }

        if (existClub) {
            throw new ConflictException("이미 있는 동아리 이름입니다.");
        }

        if (file) {
            const club = await this.clubRepository.save({
                ...createClubDto,
                users: [user],
                masterId: user.id,
                image: await this.awsService.fileupload(file),
            });
            return club;
        }

        const club = await this.clubRepository.save({
            ...createClubDto,
            users: [user],
            masterId: user.id,
        });
        return club;
    }

    async updateClub(
        id: number,
        userId: number,
        updateClubDto: UpdateClubDto,
        file: Express.Multer.File,
    ) {
        const { name, region, description } = updateClubDto;
        const user = await this.userService.findUserById(userId);
        const club = await this.clubRepository.findOne({ where: { id } });
        const existClub = await this.clubRepository.findOne({
            where: { name },
        });
        if (!club) {
            throw new NotFoundException("동아리가 존재하지 않습니다.");
        }

        // if (existClub) {
        //     throw new ConflictException("이미 있는 동아리 이름입니다.");
        // }

        if (club.masterId !== user.id) {
            throw new UnauthorizedException("수정할 권한이 없습니다.");
        }

        club.name = updateClubDto.name;
        club.region = updateClubDto.region;
        club.description = updateClubDto.description;

        if (file) {
            club.image = await this.awsService.fileupload(file);
        }

        await this.clubRepository.save(club);

        return club;
    }

    async deleteClub(id: number, userId: number) {
        const user = await this.userService.findUserById(userId);
        const club = await this.clubRepository.findOne({ where: { id } });

        if (!club) {
            throw new NotFoundException("동아리가 존재하지 않습니다.");
        }

        if (club.masterId !== user.id) {
            throw new UnauthorizedException("삭제할 권한이 없습니다.");
        }
        await this.clubRepository.delete({ id });

        return {
            message: "동아리가 성공적으로 삭제되었습니다.",
        };
    }

    async isMyClub(userId: number, clubId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user.clubId) {
            throw new NotFoundException("동호회에 가입되지 않은 유저입니다.");
        }
        if (clubId !== user.clubId) {
            throw new NotFoundException("동호회에 가입된 사람이 아닙니다");
        }

        const club = await this.clubRepository.findOne({
            where: { id: clubId },
        });
        const clubMasterId = club.masterId;

        if (userId !== clubMasterId) {
            throw new NotFoundException("동호회장이 아닙니다");
        }

        return true;
    }

    async hasClub(userId: number) {
        console.log("3#####");

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (user.clubId) {
            console.log("4#####");
            throw new Error("이미 동아리에 가입되어 있습니다.");
        }
        console.log("5#####");
        return true;
    }

    async getMyClubId(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user.clubId) {
            throw new NotFoundException("가입한 동아리가 없습니다.");
        }
        console.log("ggggg");

        return user.clubId;
    }

    async isClubMaster(userId) {
        const clubMaster = await this.clubRepository.findOne({
            where: { masterId: userId },
        });

        console.log("클럽 마스터", clubMaster);
        if (!clubMaster) {
            throw new NotFoundException("동아리 장이 아닙니다.");
        }

        return true;
    }

    async withdrawClub(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("해당하는 유저가 존재하지 않습니다.");
        }

        const club = await this.clubRepository.findOne({
            where: { masterId: userId },
        });
        if (club) {
            throw new ForbiddenException("동아리 장은 탈퇴할 수 없습니다.");
        }
        const withdraw = await this.userRepository.update(userId, {
            clubId: null,
        });

        return withdraw;
    }

    async expelMember(userId: number, expelMemeberDto: ExpelMemberDto) {
        const { nickName } = expelMemeberDto;

        const clubMaster = await this.clubRepository.findOne({
            where: { masterId: userId },
        });

        if (!clubMaster) {
            throw new NotFoundException(
                "동아리 장만 멤버를 추방할 수 있습니다.",
            );
        }
        const member = await this.userProfileRepository.findOne({
            where: { nickname: nickName },
            select: ["id", "nickname", "userId"],
        });
        console.log(member);
        if (!member) {
            throw new NotFoundException(
                "해당하는 닉네임을 가진 멤버가 없습니다.",
            );
        }
        const memberId = member.userId;
        const expeledMember = await this.userRepository.update(memberId, {
            clubId: null,
        });
        console.log("***확인5***");
        return expeledMember;
    }

    async getAllClubMember(clubId: number) {
        console.log("클럽아뒤", clubId);
        const userInfos = await this.userRepository.find({ where: { clubId } });
        if (!userInfos.length) {
            throw new NotFoundException("존재하지 않는 동아리입니다.");
        }

        let users = [];
        userInfos.forEach((userInfo) => {
            users.push(userInfo.id);
            console.log("userInfoId", userInfo.id);
        });

        console.log("유저스", users);

        // 비동기 작업을 기다리고 결과를 모두 수집하기 위해 Promise.all 사용
        const userData = await Promise.all(
            users.map(async (userId) => {
                console.log("userId", userId);
                let userProfile = await this.userProfileRepository.findOne({
                    where: { userId },
                });

                console.log("유저 프로필", userProfile);
                // console.log("유저프로필닉네임", userProfile.nickname);

                const user = await this.userRepository.findOne({
                    where: { id: userId },
                });
                const userName = user.name;

                if (!userProfile) {
                    return { nickname: null, userName: userName };
                }
                return { nickname: userProfile.nickname, userName: userName };
            }),
        );

        console.log("유저 데이터", userData);

        // 닉네임과 유저 이름을 포함한 배열을 반환
        return userData;
    }

    async getClubByUserId(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userClub = user.clubId;
        if (!userClub) {
            console.log("가입한 동아리가 없습니다.");
        }
        return userClub;
    }
}
