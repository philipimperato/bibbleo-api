import { IsDefined } from 'class-validator';

export class ResetPasswordDto {
  @IsDefined()
  currentPassword: string;

  @IsDefined()
  newPassword: string;
}
