import { ApiProperty } from "@nestjs/swagger";

export class CreateUserPositionDto {
    // @ApiProperty({ description: "가드" })
    guard: boolean;

    // @ApiProperty({ description: "포워드" })
    forward: boolean;

    // @ApiProperty({ description: "센터" })
    center: boolean;
}
