import {
    ConflictException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserCalenderDto } from "./dto/create-user-calender.dto";
import { UpdateUserCalenderDto } from "./dto/update-user-calender.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "src/entity/user.entity";
import { UserCalender } from "src/entity/user-calender.entity";

@Injectable()
export class UserCalenderService {
    constructor(
        @InjectRepository(UserCalender)
        private readonly userCalenderRepository: Repository<UserCalender>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    //캘린더 일정 작성하기
    async create(userId, createUserCalenderDto: CreateUserCalenderDto) {
        const userCalendarDate = new Date(createUserCalenderDto.date);

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["userCalender"],
        });
        if (!user) {
            throw new NotFoundException("유저 정보가 없습니다.");
        }

        const userCalendar = this.userCalenderRepository.create({
            ...createUserCalenderDto,
            date: userCalendarDate,
            user: user,
        });

        const createdUserCalender =
            await this.userCalenderRepository.save(userCalendar);
        delete createdUserCalender.user;
        return {
            statusCode: 201,
            message: "캘린더를 성공적으로 생성했습니다.",
            data: { userCalendar: createdUserCalender },
        };
    }

    async findCalenderByDate(userId, date) {
        // 해당 날짜의 시작과 끝을 계산
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const calenders = await this.userCalenderRepository.find({
            where: {
                date: Between(startOfDay, endOfDay),
                userId: userId,
            },
            relations: ["user"],
        });

        if (!calenders || calenders.length === 0) {
            return {
                statusCode: 200, // 상태 코드를 200으로 변경
                message: "해당 날짜에 등록된 일정이 없습니다.",
                data: null, // 데이터를 null로 설정
            };
        }

        // 권한 체크 및 필요한 정보 처리 (예: user 필드 삭제)
        calenders.forEach((calender) => {
            if (calender.user.id !== userId) {
                throw new NotAcceptableException("권한이 없습니다.");
            }
            delete calender.user;
        });

        return {
            statusCode: 200,
            message: "해당 일정의 캘린더를 조회했습니다.",
            data: { calenders },
        };
    }

    //내 캘린더 일정 전체 조회하기 (userId를 이용해서 전체 캘린더 찾기)
    async findAll(userId) {
        const findCalenderByUserId = await this.userCalenderRepository.find({
            where: { userId },
        });
        if (findCalenderByUserId.length < 1) {
            throw new NotFoundException("등록된 일정이 없습니다.");
        }

        return {
            statusCode: 200,
            message: "전체 캘린더 목록을 조회했습니다.",
            data: { findCalenderByUserId },
        };
    }

    //캘린더 수정하기
    async update(
        userId,
        calenderId,
        updateUserCalenderDto: UpdateUserCalenderDto,
    ) {
        const { date, title, description, color } = updateUserCalenderDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userCalender = await this.userCalenderRepository.findOne({
            where: { id: calenderId },
            relations: ["user"],
        });
        if (!userCalender) {
            throw new NotFoundException(
                "해당 캘린더에 일정이 존재하지 않습니다.",
            );
        }
        if (userCalender.user.id !== userId) {
            throw new NotAcceptableException("권한이 없습니다.");
        }

        if (date) {
            userCalender.date = new Date(date);
        }
        if (title) {
            userCalender.title = title;
        }
        if (description) {
            userCalender.description = description;
        }
        if (color) {
            userCalender.color = color;
        }
        const updatedUserCalender =
            await this.userCalenderRepository.save(userCalender);
        delete updatedUserCalender.user;
        return {
            statusCode: 200,
            message: "캘린더 일정 수정을 성공했습니다.",
            data: { userCalender: updatedUserCalender },
        };
    }

    //캘린더 일정 삭제하기
    async remove(userId, calenderId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userCalender = await this.userCalenderRepository.findOne({
            where: { id: calenderId },
            relations: ["user"],
        });
        if (!userCalender) {
            throw new NotFoundException(
                "해당 캘린더에 일정이 존재하지 않습니다.",
            );
        }
        if (userCalender.user.id !== userId) {
            throw new NotAcceptableException("권한이 없습니다.");
        }
        await this.userCalenderRepository.remove(userCalender);
        return {
            statusCode: 200,
            message: "캘린더 일정 삭제를 성공했습니다.",
        };
    }
}
