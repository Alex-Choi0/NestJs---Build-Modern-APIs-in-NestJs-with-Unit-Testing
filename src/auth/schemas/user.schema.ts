import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ select: false }) // slelct : false는 응답시 select를 선택하지 않게 해준다.
  password: string;

  @Prop({
    enum: UserRoles,
    defalult: UserRoles.USER,
  })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);