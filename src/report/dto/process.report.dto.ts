import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Progress } from "../../entity/report.entity";

export class ReportProcessDTO {
    @IsEnum(Progress)
    @IsNotEmpty()
    @ApiProperty({
        example: "승인",
        description: "승인/거절",
    })
    progress: Progress;
}
