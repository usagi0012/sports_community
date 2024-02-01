import { UserType } from "../../entity/user.entity";

import { SetMetadata } from "@nestjs/common";

export const Usertypes = (...usertypes: UserType[]) =>
    SetMetadata("usertypes", usertypes);
