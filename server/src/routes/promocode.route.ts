import { Router } from 'express';
import { createPromoCode, deletePromoCode, getAllPromoCodes, updatePromoCode, verifyPromoCode } from '../controllers/promocode.controller';

const promoCodeRoute = () => {
  const router = Router();

  router.get('/allPromocodes', getAllPromoCodes);
  router.route('/promoCode').post(createPromoCode);
  router.route('/promoCode/:id').delete(deletePromoCode).put(updatePromoCode);
  router.route('/verifyPromoCode/:promoValue').get(verifyPromoCode);

  return router;
};

export { promoCodeRoute };
