import { Router } from 'express';
import { addComment, getCommentsForChallenge, replyToComment } from '../controllers/comment.controller';
import { UploadMedia } from '../utils/multer';

const commentRoute = () => {
  const router = Router();

  router.get('/getChallengeComments/:challengeId', getCommentsForChallenge);
  router.post('/addComment/:challengeId', UploadMedia.single('media'), addComment);
  router.post('/replyToComment', UploadMedia.single('media'), replyToComment);

  return router;
};

export { commentRoute };
