import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role>("role", [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();

    return required == user.role;
  }
}
