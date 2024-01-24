import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserPositionDto } from "./dto/create-user-position.dto";
import { UpdateUserPositionDto } from "./dto/update-user-position.dto";
import { UserPosition } from "src/entity/user-position.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserPositionService {
    constructor(
        @InjectRepository(UserPosition)
        private readonly userPositionRepository: Repository<UserPosition>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    //포지션 작성하기
    async create(userId, createUserPositionDto: CreateUserPositionDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["userPosition"],
        });
        if (user.id !== userId) {
            throw new NotAcceptableException("권한이 없습니다.");
        }
        const existingPosition = await this.userPositionRepository.findOne({
            where: { userId },
            relations: ["user"],
        });
        if (existingPosition) {
            throw new NotFoundException(
                "포지션을 작성하셨습니다. 수정해주세요",
            );
        }

        const userPosition = new UserPosition();
        userPosition.guard = createUserPositionDto.guard || false;
        userPosition.center = createUserPositionDto.center || false;
        userPosition.forward = createUserPositionDto.forward || false;
        userPosition.userId = user.id;

        const createdPosition =
            await this.userPositionRepository.save(userPosition);
        return {
            statusCode: 201,
            message: "선호 포지션 등록을 성공했습니다.",
            data: { createdPosition },
        };
    }

    //내 포지션 조회하기
    async findOne(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["userPosition"],
        });
        if (user.id !== userId) {
            throw new NotAcceptableException("권한이 없습니다.");
        }
        const findPositionByUserId = await this.userPositionRepository.find({
            where: { userId: user.id },
        });
        if (findPositionByUserId.length < 1) {
            throw new NotFoundException("등록된 포지션 정보가 없습니다.");
        }

        return {
            statusCode: 200,
            message: "포지션 조회를 성공했습니다.",
            data: { findPositionByUserId },
        };
    }

    //포지션 수정하기
    async update(userId, updateUserPositionDto: UpdateUserPositionDto) {
        const { guard, forward, center } = updateUserPositionDto;
        const user = await this.userRepository.find({
            where: { id: userId },
        });

        const userPosition = await this.userPositionRepository.findOne({
            where: { userId },
            relations: ["user"],
        });
        if (userPosition.user.id !== userId) {
            throw new NotAcceptableException("권한이 없습니다.");
        }
        if (!userPosition) {
            throw new NotFoundException("포지션을 먼저 작성해주세요.");
        }
        // 포지션 업데이트
        userPosition.guard = guard !== undefined ? guard : userPosition.guard;
        userPosition.forward =
            forward !== undefined ? forward : userPosition.forward;
        userPosition.center =
            center !== undefined ? center : userPosition.center;

        // 업데이트된 포지션 저장
        const updatedUserPosition =
            await this.userPositionRepository.save(userPosition);
        delete updatedUserPosition.user;

        return {
            statusCode: 200,
            message: "포지션 수정이 성공했습니다.",
            data: { updatedUserPosition },
        };
    }

    //포지션 삭제
    async remove(userId) {
        console.log(userId);
        const userPosition = await this.userPositionRepository.findOne({
            where: { userId },
        });
        console.log(userPosition);
        await this.userPositionRepository.remove(userPosition);
    }
}
