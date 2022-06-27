import mongoose, { Schema, Model, Document } from 'mongoose';

type UserDocument = Document & {
  fullName: string;
  email: string;
  password: string;
  enabled: boolean;
  stripePass: string;
  avatarImg: string;
  about: string;
  profession: string;
  phone: string;
  linkedIn: string;
  portFolio: string;
  createdAt: string;
  updatedAt: string;
  passwordUpdatedAt: string;
};

type UserInput = {
  fullName: UserDocument['fullName'];
  email: UserDocument['email'];
  password?: UserDocument['password'];
  enabled?: UserDocument['enabled'];
  avatarImg?: UserDocument['avatarImg'];
  about?: UserDocument['about'];
  profession?: UserDocument['profession'];
  phone?: UserDocument['phone'];
  linkedIn?: UserDocument['linkedIn'];
  portFolio?: UserDocument['portFolio'];
};

const usersSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    profession: {
      type: Schema.Types.String,
      required: false,
    },
    linkedIn: {
      type: Schema.Types.String,
      required: false,
    },
    portFolio: {
      type: Schema.Types.String,
      required: false,
    },
    avatarImg: {
      type: Schema.Types.String,
      required: false,
    },
    about: {
      type: Schema.Types.String,
      required: false,
    },
    phone: {
      type: Schema.Types.String,
      required: false,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    stripePass: {
      type: Schema.Types.String,
      required: false,
    },
    password: {
      type: Schema.Types.String,
      required: false,
    },
    passwordUpdatedAt: {
      type: Schema.Types.String,
      required: false,
      default: new Date().toISOString(),
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument };
