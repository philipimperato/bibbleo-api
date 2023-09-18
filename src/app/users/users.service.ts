import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import _IFindParams from '../../http/interfaces/_find-params';

@Injectable()
export class UsersService {
  public readonly PK = 'userId';

  constructor(
    @InjectModel(User)
    private readonly $repo: typeof User,
  ) {}

  create(createDto: CreateUserDto): Promise<void | User> {
    return this.$repo
      .create({ ...createDto }, { returning: true })
      .catch((e) => {
        const { name, message } = e;

        switch (name) {
          case 'SequelizeValidationError':
            throw new BadRequestException('Email Is not unique', {
              cause: new Error(),
              description: message,
            });
          case 'SequelizeUniqueConstraintError':
            throw new BadRequestException('Email Is not unique', {
              cause: new Error(),
              description: 'User already exists',
            });
        }
      });
  }

  findAll({ $limit, $skip, ...where }) {
    return this.$repo.findAndCountAll({
      where,
      limit: $limit,
      offset: $skip,
    });
  }

  async findOne({ query: where }): Promise<User> {
    const result = await this.$repo.findAndCountAll({ where });
    const users = result.rows;
    return (users.length ? users[0] : null) as User;
  }

  async _findOne({ query: where }) {
    const result = await this.$repo
      .scope('internal')
      .findAndCountAll({ where });
    const users = result.rows;
    return (users.length ? users[0] : null) as User;
  }

  get(id: number) {
    return this.$repo.findByPk(id);
  }

  _get(id: number | null, params?: _IFindParams) {
    const where = !id ? params.query : { [this.PK]: id };
    return this.$repo.scope('internal').findOne({ where });
  }

  update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    return this.$repo.update(
      { ...updateUserDto },
      { where: { [this.PK]: id }, returning: true },
    );
  }

  remove(id: number) {
    return this.$repo.destroy({
      where: { [this.PK]: id },
    });
  }
}
