import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import _IFindParams from '../../http/interfaces/_find-params';

@Injectable()
export class UsersService {
  private readonly PK = 'userId';

  constructor(
    @InjectModel(User)
    private readonly $repo: typeof User,
  ) {}

  create(createDto: CreateUserDto): Promise<any> {
    return this.$repo.create({ ...createDto });
  }

  findAll({ $limit, $skip, ...where }) {
    return this.$repo.findAndCountAll({
      where,
      limit: $limit,
      offset: $skip,
    });
  }

  findOne(id: number) {
    return this.$repo.findByPk(id);
  }

  // _findOne(5)
  // _findOne(null, { query: { userId } })
  // _findOne(null, { query: { $limit: 2 } })
  _findOne(id: number | null, params: _IFindParams) {
    const where = !id ? params.query : { [this.PK]: id };
    return this.$repo.scope('internal').findOne({ where });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
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
