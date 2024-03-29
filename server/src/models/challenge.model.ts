import mongoose, { Schema, Model, Document } from 'mongoose';
// import { User } from './user.model';

type ChallengeDocument = Document & {
  img: string;
  title: string;
  desc: string;
  technologyStack: string[];
  price: number;
  concatString: string;
  level: string;
  type: string;
};

const challengeSchema = new Schema(
  {
    img: { type: String, default: null },
    title: { type: String, required: true },
    technologyStack: [{ type: String, required: true }],
    price: { type: Number },
    desc: { type: String },
    concatString: { type: String, required: false },
    level: { type: String },
    type: { type: String, required: true },
  },
  {
    collection: 'challenges',
    timestamps: true,
    minimize: false,
  },
);

const Challenge: Model<ChallengeDocument> = mongoose.model<ChallengeDocument>('Challenge', challengeSchema);

export { Challenge, ChallengeDocument };
