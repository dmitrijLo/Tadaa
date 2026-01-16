import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async onApplicationBootstrap() {
    await this.seedDevUser();
  }

  private async seedDevUser() {
    if (process.env.JWT_DEV_MODE !== 'true') {
      return;
    }

    const devUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const userExists = await this.usersRepository.findOneBy({ id: devUserId });

    if (!userExists) {
      this.logger.log('Seeding default Dev-User');
      const devUser = this.usersRepository.create({
        id: devUserId,
        email: 'dev@tadaa.app',
        name: 'max_power',
        passwordHash: await bcrypt.hash('super-secret', 12),
      });

      await this.usersRepository.save(devUser);
      this.logger.log(`Dev-User created: ${devUserId}`);
    } else {
      this.logger.debug('Dev-User already exists. Skipping seed.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findbyId(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findbyId(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const usertoDelete = await this.usersRepository.delete(id);
    if (usertoDelete.affected === 0) {
      throw new Error('User not found');
    }
  }
}
