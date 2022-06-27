import { Router } from 'express';
import { getRepo } from '../controllers/githubRepo.controller';
// import { login, signUp, verifyAuthTokken } from '../controllers/auth.controller';

const githubRepoRoute = () => {
  const router = Router();

  router.get('/repo', getRepo);

  return router;
};

export { githubRepoRoute };
