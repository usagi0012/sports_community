import { IsNotEmpty, IsString } from "class-validator";

export class MatchDTO {
    @IsNotEmpty()
    @IsString()
    message: string;
}
