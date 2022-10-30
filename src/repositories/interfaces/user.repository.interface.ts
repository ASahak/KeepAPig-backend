import { BaseRepository } from '@/repositories/base/base.abstract.repository';
import { User } from '@/modules/user/schema/user.schema';

export type UserRepositoryInterface = BaseRepository<User>;
