import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { CommentDocument, Comment } from '../models/comment.model';

const addComment = async (req: Request, res: Response) => {
  try {
    const media: string = req?.file ? `${req?.file?.destination.replace('./server/public/', '')}/${req?.file?.filename}` : '';

    const commentToAdd: CommentDocument = req.body;
    const { challengeId } = req.params;

    const addedComment = await Comment.create({
      ...commentToAdd,
      challengeId,
      media,
      commentedBy: mongoose.Types.ObjectId(commentToAdd.commentedBy),
    });

    return res.status(200).json({ message: 'success', data: { addedComment } });
  } catch (error) {
    console.log('Error is -->', error);
    return res.status(404).json({ message: 'fail', error });
  }
};

type ReplyCommentBody = {
  comment: string;
  commentedBy: string;
  media?: string;
  replyToId: string;
};

const replyToComment = async (req: Request, res: Response) => {
  try {
    const media = req?.file ? `${req?.file?.destination.replace('./server/public/', '')}/${req?.file?.filename}` : '';

    const { comment, commentedBy, replyToId }: ReplyCommentBody = req.body;

    if (!comment || !replyToId) {
      throw new Error('Comment and reply id are required fields!');
    }

    const addedComment = await Comment.create({
      comment: comment,
      commentedBy: mongoose.Types.ObjectId(commentedBy),
      media: media,
      replyToId: replyToId,
      isReply: true,
    });

    const parentCommnt = await Comment.findById(replyToId).exec();

    parentCommnt?.childId.push(mongoose.Types.ObjectId(addedComment._id));

    await parentCommnt?.save();

    // const updatedComment = await Comment.findByIdAndUpdate(replyToId, parentCommnt, { new: true, runValidators: true });

    // Comment.findByIdAndUpdate(replyToId, { childId: [addedId] });

    return res.status(200).json({ message: 'success', data: { addedComment } });
  } catch (error) {
    console.log('Error is --> ', error);
    return res.status(404).json({ message: 'fail', error });
  }
};

const getCommentsForChallenge = async (req: Request, res: Response) => {
  const { challengeId } = req.params;

  try {
    const comments = await Comment.find({ challengeId, isReply: false })
      .populate('commentedBy')
      .populate({
        path: 'childId',
        populate: {
          path: 'commentedBy',
          model: 'User',
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({ message: 'success', data: comments });
  } catch (error) {
    console.log('Error is -->', error);
    return res.status(404).json({ message: 'fail', error });
  }
};

export { addComment, getCommentsForChallenge, replyToComment };
