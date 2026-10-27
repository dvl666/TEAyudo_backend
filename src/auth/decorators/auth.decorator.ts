import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../interfaces/valid-roles.interface";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user/user.guard";

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards( AuthGuard(), UserRoleGuard )
    )
}