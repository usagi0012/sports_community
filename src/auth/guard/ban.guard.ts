import { UserType } from "../../entity/user.entity";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class BanGuard extends AuthGuard("jwt") implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const authenticated = await super.canActivate(context);
        if (!authenticated) {
            return false;
        }

        const requiredUsertypes = this.reflector.getAllAndOverride<UserType[]>(
            "usertypes",
            [context.getHandler(), context.getClass()],
        );

        const bannedUsers = this.reflector.getAllAndOverride<UserType[]>(
            "bannedUsers",
            [context.getHandler(), context.getClass()],
        );

        if (bannedUsers && this.isBannedUser(context, bannedUsers)) {
            return false;
        }

        if (!requiredUsertypes) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        return requiredUsertypes.some((usertype) => user.usertype === usertype);
    }

    private isBannedUser(
        context: ExecutionContext,
        bannedUserTypes: UserType[],
    ): boolean {
        const { user } = context.switchToHttp().getRequest();
        return bannedUserTypes.includes(user.usertype);
    }
}
