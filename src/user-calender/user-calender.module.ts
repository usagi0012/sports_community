import { Module } from "@nestjs/common";
import { UserCalenderService } from "./user-calender.service";
import { UserCalenderController } from "./user-calender.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { UserCalender } from "src/entity/user-calender.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserCalender, User])],
    controllers: [UserCalenderController],
    providers: [UserCalenderService],
})
export class UserCalenderModule {}
