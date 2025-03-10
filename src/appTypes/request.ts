import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface RequestAuthentificate extends Request {
  user: User;
}
