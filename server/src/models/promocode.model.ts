import mongoose, { Schema, Model, Document } from 'mongoose';

type PromoCodeDocument = Document & {
  promoCode: string;
  email: string;
  discount: number;
  tototalSignedUpUsers: number;
  totalPaidAmount: number;
  enabled: boolean;
};

const PromoCodeSchema = new Schema(
  {
    promoCode: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    enabled: { type: Boolean, required: false, default: false },
    tototalSignedUpUsers: { type: Number, required: false, default: 0 },
    totalPaidAmount: { type: Number, required: false, default: 0 },
  },
  {
    collection: 'promoCodes',
    timestamps: true,
    minimize: false,
  },
);

const PromoCode: Model<PromoCodeDocument> = mongoose.model<PromoCodeDocument>('PromoCode', PromoCodeSchema);

export { PromoCode, PromoCodeDocument };
