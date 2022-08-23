import { Router } from 'express';
import { addChallenge, deleteChallenge, getAllChallenges, getSingleChallnge, updateChallenge } from '../controllers/challenge.controller';

const challengeRoute = () => {
  const router = Router();

  router.get('/challenges', getAllChallenges);

  router.delete('/challenge/:challengeId', deleteChallenge);
  router.put('/challenge/:challengeId', updateChallenge);

  router.post('/addChallenge', addChallenge);
  router.post('/singleChallenge', getSingleChallnge);

  return router;
};

export { challengeRoute };
