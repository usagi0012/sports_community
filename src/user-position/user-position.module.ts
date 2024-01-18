import { Module } from "@nestjs/common";
import { UserPositionService } from "./user-position.service";
import { UserPositionController } from "./user-position.controller";
import { UserPosition } from "src/entity/user-position.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserPosition, User])],
    controllers: [UserPositionController],
    providers: [UserPositionService],
})
export class UserPositionModule {}
