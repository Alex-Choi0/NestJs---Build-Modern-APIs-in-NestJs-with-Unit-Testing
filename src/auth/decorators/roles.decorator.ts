import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => {
  console.log('Activate Roles');
  return SetMetadata('roles', roles);
};
