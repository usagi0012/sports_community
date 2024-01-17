import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCalender } from "src/entity/user-calender.entity";
import { UserPosition } from "src/entity/user-position.entity";
import { UserProfile } from "src/entity/user-profile.entity";
import { Match } from "src/entity/match.entity";
import { Recruit } from "src/entity/recruit.enti
import { User } from "src/entity/user.entity";

@Module({})
export class TypeormModule {
    static forRoot(): DynamicModule {
        const typeormModule: DynamicModule = TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "mysql",
                host: configService.get<string>("DATABASE_HOST"),
                port: configService.get<number>("DATABASE_PORT"),
                username: configService.get<string>("DATABASE_USERNAME"),
                password: configService.get<string>("DATABASE_PASSWORD"),
                data\
                entities: [User, UserCalender, UserPosition, UserProfile,Recruit, Match],
                synchronize: true,
            }),
            inject: [ConfigService],
        });

        return {
            module: TypeOrmModule,
            imports: [typeormModule],
            exports: [typeormModule],
        };
    }
}
