import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Club } from "src/entity/club.entity";
import { UserService } from "../user/user.service";
import { Repository } from "typeorm";
import { CreateClubDto } from "./dto/createClub.dto";
import { UpdateClubDto } from "./dto/updateClub.dto";
import { AwsService } from "../aws/aws.service";

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        private readonly userService: UserService,
        private readonly awsService: AwsService,
    ) {}

    async getAllClubs() {
        const clubs = await this.clubRepository.find({
            select: ["id", "name", "region", "masterId", "score"],
        });
        return clubs;
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
        const user = await this.userService.findUserById(userId);
        if (user.clubId) {
            throw new ConflictException("동아리는 하나만 가입할 수 있습니다.");
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
        const user = await this.userService.findUserById(userId);
        const club = await this.clubRepository.findOne({ where: { id } });
        if (!club) {
            throw new NotFoundException("동아리가 존재하지 않습니다.");
        }

        if (club.masterId !== user.id) {
            throw new UnauthorizedException("수정할 권한이 없습니다.");
        }

        club.name = updateClubDto.name;
        club.region = updateClubDto.region;
        club.description = updateClubDto.description;
        club.image = await this.awsService.fileupload(file);

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
}
