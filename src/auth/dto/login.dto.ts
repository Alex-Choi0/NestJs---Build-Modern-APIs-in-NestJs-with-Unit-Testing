import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: '이메일',
    example: 'alex@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({ message: 'Please enter correct email address' })
  readonly email: string;

  @ApiProperty({
    required: true,
    description: '비밀번호. 최소 8글자 이상',
    example: 'safepassword',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password length should be at least 8' })
  readonly password: string;
}
