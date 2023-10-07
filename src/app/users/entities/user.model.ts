import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Scopes,
} from 'sequelize-typescript';
import ROLES from './../../roles/roles';

@Scopes(() => ({
  defaultScope: {
    attributes: { exclude: ['refreshToken', 'password'] },
  },
  internal: {},
}))
@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastname: string;

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string;

  @Column({ type: DataType.DATE, allowNull: true })
  lastLoginAt: string;

  @Column({ type: DataType.DATE, allowNull: true })
  status: 'new' | 'active' | 'inactive' | 'archived';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: ROLES.User,
  })
  roleId: string;
}
