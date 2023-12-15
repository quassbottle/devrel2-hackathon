import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export function Roles(role: Role) {
  return SetMetadata('role', role);
}
