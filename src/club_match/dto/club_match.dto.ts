import { ApiProperty } from "@nestjs/swagger";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";
import { ClubMatchStatus } from "src/entity/club_match.entity";

export class ClubMatchDTO {
    @IsNotEmpty()
    @ApiProperty({ description: "대전 메세지", example: "한판하자" })
    @IsString()
    message: string;

    @IsNotEmpty()
    @ApiProperty({ description: "정보", example: "어디서 어디서 보자" })
    @IsString()
    information: string;

    @IsNotEmpty()
    @ApiProperty({ description: "경기시간", example: "2024-01-23T00:00:00Z" })
    @IsDate()
    gameDate: Date;

    @IsNotEmpty()
    @ApiProperty({ description: "끝나는시간", example: 2 })
    @IsNumber()
    endTime: number;
}

export class CheckClubMatchDTO {
    @IsNotEmpty()
    @ApiProperty({ description: "승인/거절", example: "취소" })
    @IsEnum(ClubMatchStatus)
    status: ClubMatchStatus;
}
export class ChangeTimeDTO {
    @IsNotEmpty()
    @ApiProperty({ description: "경기시간", example: "2024-01-23T03:00:00Z" })
    @IsDate()
    gameDate: Date;

    @IsNotEmpty()
    @ApiProperty({ description: "끝나는시간", example: "2024-01-23T03:30:00Z" })
    @IsDate()
    endTime: Date;
}
