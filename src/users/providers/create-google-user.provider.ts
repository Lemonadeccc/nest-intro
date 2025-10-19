import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    // inject usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      // create a new user
      const newUser = this.usersRepository.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        googleId: googleUser.googleId,
      });
      // save the new user
      const savedUser = await this.usersRepository.save(newUser);
      // return the new user
      return savedUser;
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could Not Create A New User',
      });
    }
  }
}
