import mongoose, { Schema, Model, Document } from 'mongoose';
import { User } from './user.model';

type CommentDocument = Document & {
  comment: string;
  isReply: boolean;
  media?: string;
  commentedBy: string;
  childId: mongoose.Types.ObjectId[];
  replyCount: number;
  challengeId?: mongoose.Types.ObjectId;
};

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    media: { type: String, default: null },
    challengeId: { type: String, default: 'challenge_1' },
    childId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],
    replyCount: { type: Number, default: 0 },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    isReply: { type: Boolean, default: false },
  },
  {
    collection: 'comments',
    timestamps: true,
    minimize: false,
  },
);

const Comment: Model<CommentDocument> = mongoose.model<CommentDocument>('Comment', commentSchema);

export { Comment, CommentDocument };
