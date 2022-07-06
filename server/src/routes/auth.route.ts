import { Router } from 'express';
import {
  login,
  signUp,
  verifyAuthTokken,
  findUserByTokken,
  createAndSendResetPasswordUrl,
  changePassword,
  resetPassword,
  verifyAuthTokkenAdmin,
} from '../controllers/auth.controller';

const authRoute = () => {
  const router = Router();

  router.post('/login', login);

  router.post('/getProfile', findUserByTokken);

  router.post('/createAndSendResetPasswordUrl', createAndSendResetPasswordUrl);

  router.post('/resetPassword', resetPassword);

  router.post('/changePassword', changePassword);

  router.post('/verifyAuth', verifyAuthTokken);

  router.post('/verifyAuthAdmin', verifyAuthTokkenAdmin);

  router.post('/register', signUp);

  return router;
};

export { authRoute };
