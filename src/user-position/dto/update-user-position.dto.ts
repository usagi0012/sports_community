import { PartialType } from "@nestjs/mapped-types";
import { CreateUserPositionDto } from "./create-user-position.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserPositionDto {
    //     @ApiProperty({ description: "가드" })
    guard: boolean;

    // @ApiProperty({ description: "포워드" })
    forward: boolean;

    // @ApiProperty({ description: "센터" })
    center: boolean;
}
