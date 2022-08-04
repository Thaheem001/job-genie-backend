import { Request, Response } from 'express';
import { PromoCode, PromoCodeDocument } from '../models/promocode.model';

const getAllPromoCodes = async (req: Request, res: Response) => {
  try {
    const allPromoCodes: PromoCodeDocument[] = await PromoCode.find().exec();

    return res.status(200).json({ data: allPromoCodes });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const verifyPromoCode = async (req: Request, res: Response) => {
  try {
    const promoValueToVerify = req.params.promoValue;

    const promoCodes = await PromoCode.find({ promoCode: promoValueToVerify }).exec();

    if (promoCodes.length < 1 || !promoCodes[0].enabled) {
      return res.status(400).json({ error: { message: 'promo code is invalid' } });
    }

    return res.status(200).json({ data: promoCodes[0] });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const createPromoCode = async (req: Request, res: Response) => {
  try {
    const { discount, email, promoCode }: PromoCodeDocument = req.body;
    const promoToSave = await PromoCode.create({ promoCode, email, discount, enabled: true });

    return res.status(200).json({ data: promoToSave });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const updatePromoCode = async (req: Request, res: Response) => {
  try {
    const promoId: string = req.params.id;
    const { discount }: PromoCodeDocument = req.body;
    const promoCodeToUpdate: PromoCodeDocument | null = await PromoCode.findById(promoId).exec();

    if (!promoCodeToUpdate) {
      res.status(400).json({ status: 'fail', message: 'This promo not found' });
    }

    const result = await PromoCode.findByIdAndUpdate(promoId, { discount });

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const deletePromoCode = async (req: Request, res: Response) => {
  try {
    const promoId: string = req.params.id;

    const promoCodeToUpdate: PromoCodeDocument | null = await PromoCode.findById(promoId).exec();

    if (!promoCodeToUpdate) {
      res.status(400).json({ status: 'fail', message: 'This promo code not found' });
    }

    await PromoCode.findByIdAndDelete(promoId);

    return res.status(200).json({ data: 'Promo code deleted !' });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

export { getAllPromoCodes, createPromoCode, updatePromoCode, deletePromoCode, verifyPromoCode };
