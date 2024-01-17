import { PartialType } from "@nestjs/mapped-types";
import { CreateUserPositionDto } from "./create-user-position.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { partial } from "lodash";

export class UpdateUserPositionDto extends PartialType(CreateUserPositionDto) {
    @ApiProperty({ description: "가드" })
    @IsBoolean()
    guard: boolean;

    @ApiProperty({ description: "포워드" })
    @IsBoolean()
    forward: boolean;

    @ApiProperty({ description: "센터" })
    @IsBoolean()
    center: boolean;
}
