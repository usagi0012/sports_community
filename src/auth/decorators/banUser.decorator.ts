import { SetMetadata } from "@nestjs/common";
import { UserType } from "../../entity/user.entity";

export const BanUsers = (...usertypes: UserType[]) =>
    SetMetadata("bannedUsers", usertypes);
