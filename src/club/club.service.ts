import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Club } from "../entity/club.entity";
import { UserService } from "../user/user.service";
import { Repository } from "typeorm";
import { CreateClubDto } from "./dto/createClub.dto";
import { UpdateClubDto } from "./dto/updateClub.dto";
import { AwsService } from "../aws/aws.service";
import { User } from "src/entity/user.entity";

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly awsService: AwsService,
    ) {}

    // async getAllClubs() {
    // const clubs = await this.clubRepository.find({
    //     select: ["id", "name", "region", "masterId", "score"],
    //     relations: ["users"], // Include the users relation
    // });

    //     const clubsWithMasterNames = await Promise.all(
    //         clubs.map(async (club) => {
    //             const master = club.users.find(
    //                 (user) => user.id === club.masterId,
    //             );

    //             return {
    //                 ...club,
    //                 masterName: master ? master.name : null,
    //             };
    //         }),
    //     );

    //     return clubsWithMasterNames;
    // }

    // take랑 skip 배분을 잘 해줘야 값이 뜨ㅡ네;;
    async getAllClubs(page: number, itemsPerPage: number = 30) {
        const skip = (page - 1) * itemsPerPage;

        const [clubs, total] = await this.clubRepository.findAndCount({
            select: ["id", "name", "region", "masterId", "score"],
            relations: ["users"],
            take: 30,
            skip: 0,
        });
        console.log("Clubs:", clubs);
        console.log("Total:", total);
        const clubsWithMasterNames = await Promise.all(
            clubs.map(async (club) => {
                const master = club.users.find(
                    (user) => user.id === club.masterId,
                );

                return {
                    ...club,
                    masterName: master ? master.name : null,
                };
            }),
        );

        console.log("?!?", {
            data: clubsWithMasterNames,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / 30),
            },
        });
        return {
            data: clubsWithMasterNames,
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
        console.log("클럽!!!", clubId);
        console.log(typeof clubId);
        console.log("유저클럽!!", user.clubId);
        console.log(typeof user.clubId);
        if (!user.clubId) {
            throw new NotFoundException("동호회에 가입되지 않은 유저입니다.");
        }
        console.log("이건?");
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
}
