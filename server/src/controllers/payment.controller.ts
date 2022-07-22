import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import passwordGenerator from 'generate-password';
import Stripe from 'stripe';
import { sendMail } from '../utils/mail';
import { getUserByEmail } from './user.controller';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const STRIPE_SECRET_KEY = process.env.__DEV__ ? process.env.DEV_STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY || '', { apiVersion: '2020-08-27' });

const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentTokken } = req.body;

    if (!paymentTokken) {
      return res.status(400).json({ error: 'Not a valid token' });
    }

    const data = jwt.verify(paymentTokken, JWT_SECRET || '');

    return res.status(200).json({ data });
  } catch (err) {
    return res.json(400).json({ error: 'Somethig Went Wrong!' });
  }
};

const paymentSuccess = async (req: Request, res: Response) => {
  const { paymentTokken } = req.body;

  if (!paymentTokken) {
    return res.status(400).json({ error: 'Not a valid token' });
  }

  const data: any = jwt.verify(paymentTokken, JWT_SECRET || '');

  if (!data?.email || !data?.fullName) {
    return res.status(400).json({ error: 'tokken is invalid' });
  }

  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    return res.status(409).json({ message: 'This User Already Exists!' });
  }

  const generatedPass = passwordGenerator.generate({
    length: 16,
    strict: true,
    numbers: true,
    symbols: true,
    excludeSimilarCharacters: true,
    exclude: '/,"',
  });

  const encryptedPassword = await bcrypt.hash(generatedPass, 10);

  const createdUser = await User.create({ email: data.email, fullName: data.fullName, password: encryptedPassword, enabled: true });

  await sendMail(
    `Payment Verified Successfully!
      Here use these credentials to login to your account
      Email:${data.email}
      passowrd :${generatedPass}
  
    `,
    data.email,
  );

  // console.log('Password Successfylly Generated and sent to your email -->', generatedPass, encryptedPassword);

  return res.status(200).json({ message: 'Payment Verified & User created', data: createdUser });
};

const payForSubscription = async (req: Request, res: Response) => {
  const { email, fullName } = req.body;
  const tokkenSecret = process.env.JWT_SECRET;

  if (!email || !fullName) {
    return res.status(409).json({ error: 'Email and fullname are  required for this endpoint!' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();

  if (existingUser) {
    return res.status(409).json({ error: 'User Already Exists !' });
  }

  if (!tokkenSecret) {
    return res.status(409).json({ error: 'Something went very wrong !' });
  }

  const paymentTokken = jwt.sign({ email: email.toLowerCase(), fullName }, tokkenSecret);

  const product = {
    name: 'JobGenieDevs Subscription',
    amount: 199.99,
    quantity: 1,
  };
  const APIURL = process.env.__DEV__ ? 'http://localhost:3000' : process.env.REACT_APP_WEB_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.amount * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: 'payment',
      discounts: [
        {
          coupon: 'HE5862Zi',
        },
      ],
      success_url: `${APIURL}/paymentSuccess/${paymentTokken}`,
      cancel_url: `${APIURL}/signUp`,
    });

    const stripeId: string = session.id;

    res.status(200).json({ status: 'success', message: 'Payment Initialized Successfull for session ', stripeId });

    // req.body.stripePass = stripeId;

    // await paymentSuccess(req, res);
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

export { payForSubscription, paymentSuccess, verifyPayment };
