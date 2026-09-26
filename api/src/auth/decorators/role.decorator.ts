import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/db';

export const Roles = Reflector.createDecorator<UserRole[]>();
