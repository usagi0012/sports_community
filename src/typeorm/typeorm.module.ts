import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clubscore } from "src/entity/club.assessment.entity";
import { Clubtag } from "src/entity/club.assessment.tag.entity";
import { Userscore } from "src/entity/personal.assessment.entity";
import { Personaltag } from "src/entity/personal.assessment.tag.entity";
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
                database: configService.get<string>("DATABASE_NAME"),
                entities: [User, Clubscore, Clubtag, Userscore, Personaltag],
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
