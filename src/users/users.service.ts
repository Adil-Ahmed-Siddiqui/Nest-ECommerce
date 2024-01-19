import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  getAllUsers() {
    return this.repo.find({  });
  }

  async getSingleUser(id: number) {
    // If id is null then returns first doc. That's why use exception
    if (!id) {
      throw new BadRequestException('user not found');
    }

    const user = await this.repo.findOneBy({ id });
    if(!user) {
      throw new NotFoundException('user not found');
    }

    return user
  }

  async findByEmail(email: string, creatingUser: boolean) {
    const users = await this.repo.find({ where: { email } })

    if(creatingUser){
      if(users.length){
        throw new BadRequestException('Duplicate Email')
      }

      return 
    }

    if(!users.length) {
      throw new NotFoundException('user not found');
    }

    return users[0]
  }

  async createUser(userObject: Partial<User>) {
    await this.findByEmail(userObject.email, true)
    const user = this.repo.create(userObject);
    return this.repo.save(user);
  }

  async updateUser(id: number, userObject: Partial<User> | User){
    if(userObject instanceof User){
      return this.repo.save(userObject)
    }

    const user = await this.getSingleUser(id)
    Object.assign(user, userObject);

    return this.repo.save(user)
  }
}
