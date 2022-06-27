import { Router } from 'express';
import { addChallenge, getAllChallenges, getSingleChallnge } from '../controllers/challenge.controller';

const challengeRoute = () => {
  const router = Router();

  router.get('/challenges', getAllChallenges);
  router.post('/addChallenge', addChallenge);
  router.post('/singleChallenge', getSingleChallnge);

  return router;
};

export { challengeRoute };
