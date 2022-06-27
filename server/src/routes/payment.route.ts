import { Router } from 'express';
import { payForSubscription, paymentSuccess, verifyPayment } from '../controllers/payment.controller';

const paymentRoute = () => {
  const router = Router();

  router.post('/paynow', payForSubscription);

  router.post('/verifyPayment', verifyPayment);

  router.post('/paymentSuccess', paymentSuccess);

  return router;
};

export { paymentRoute };
