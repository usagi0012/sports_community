import { UserType } from "../../entity/user.entity";

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserTypeGuard extends AuthGuard("jwt") implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const authenticated = await super.canActivate(context);
        if (!authenticated) {
            return false;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            return false;
        }

        const requiredUsertypes = this.reflector.getAllAndOverride<UserType[]>(
            "usertypes",
            [context.getHandler(), context.getClass()],
        );
        if (!requiredUsertypes) {
            return true;
        }

        return requiredUsertypes.some((usertype) => user.usertype === usertype);
    }
}
