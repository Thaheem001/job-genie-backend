import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { createUser } from './user.controller';
import { sendMail } from '../utils/mail';
import checkAuthTokken from '../utils/checkAuthTokken';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokkenSecret = process.env.JWT_SECRET;

  if (!tokkenSecret) {
    return res.status(404).json({ message: `Something went very wrong!` });
  }

  if (!email || !password) {
    return res.status(404).json({ message: `This form requires both emal and password` });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).exec();

  if (!user || !user.enabled) {
    return res.status(404).json({ message: `Invalid Email Or Password` });
  }

  const paswordsMatch = await bcrypt.compare(password, user.password);

  if (paswordsMatch) {
    const token = jwt.sign({ id: user._id, email: user.email, fullName: user.fullName }, tokkenSecret, {
      expiresIn: '30d',
    });

    if (process.env.AUTH_COOKIE) {
      res.setHeader(process.env.AUTH_COOKIE, token);
      res.cookie(process.env.AUTH_COOKIE, token);
    }

    return res.status(200).json({ token });
  }

  return res.status(404).json({ message: `Invalid Email Or Password` });
};

const signUp = async (req: Request, res: Response) => {
  return await createUser(req, res);
};

const findUserByTokken = async (req: Request, res: Response) => {
  try {
    const tokkenSecret = process.env.JWT_SECRET;

    if (!tokkenSecret) {
      return res.status(404).json({ message: `Something went very wrong!` });
    }

    const { authTokken } = req.body;

    if (!authTokken) {
      return res.status(409).json({ error: 'Invalid tokken' });
    }

    const verifiedTokken: any = jwt.verify(authTokken, tokkenSecret);

    if (!verifiedTokken?.email) {
      return res.status(409).json({ error: 'Tokken is Malformed!' });
    }

    const user = await User.findOne({ email: verifiedTokken.email }).exec();

    if (!user || !user.enabled) {
      return res.status(404).json({ error: 'User not found!' });
    }

    if (!verifiedTokken?.exp || !verifiedTokken?.iat) {
      return res.status(409).json({ error: 'Tokken is not valid!' });
    }

    const exp = new Date(verifiedTokken?.exp * 1000);
    const now = new Date();

    if (now > exp) {
      return res.status(409).json({ error: 'Tokken Expired !' });
    }

    return res.status(200).json({ message: 'Success', data: user });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

const verifyAuthTokken = async (req: Request, res: Response) => {
  try {
    const { authTokken } = req.body;

    const verifiedTokken = await checkAuthTokken(authTokken);

    if (!verifiedTokken.isValid) {
      return res.status(409).json({ error: verifiedTokken.message });
    }

    return res.status(200).json({ message: 'Tokken Verified' });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};
const verifyAuthTokkenAdmin = async (req: Request, res: Response) => {
  try {
    const { authTokken } = req.body;

    const verifiedTokken = await checkAuthTokken(authTokken, undefined, true);

    if (!verifiedTokken.isValid) {
      return res.status(409).json({ error: verifiedTokken.message });
    }

    return res.status(200).json({ message: 'Tokken Verified' });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

const createAndSendResetPasswordUrl = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      return res.status(409).json({ error: 'User Not Found' });
    }

    const APIURL = process.env.__DEV__ ? 'http://localhost:3000' : process.env.REACT_APP_WEB_URL;
    const tokkenSecret = process.env.JWT_SECRET;
    const generatedPassResetTokken = jwt.sign({ email: email.toLowerCase(), type: 'pass_reset' }, tokkenSecret || 'nothing', { expiresIn: '1h' });
    const passwordResetUrl = `${APIURL}/resetpass/${generatedPassResetTokken}`;
    const resetPssStringTemplate = `
    <h1> Password Reset ! </h1>
    <p>A password reset request was generated using your account kindly visit the following link to 
    reset your password withing 1hour! or you can ignore this if you didn't request password reset!
    </p>
    <a href="${passwordResetUrl}" > Reset Your Password Here ! </a>


    `;

    await sendMail(resetPssStringTemplate, email, true);

    return res.status(200).json({ message: 'Password Reset Link was sent to your email!' });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, resetPasswordTokken } = req.body;

    if (!newPassword) {
      return res.status(409).json({ error: 'New Password Is Required !' });
    }

    const tokkenSecret = process.env.JWT_SECRET;

    if (!tokkenSecret) {
      return res.status(409).json({ error: 'Something Wierd Happend !' });
    }

    const verifiedTokken = await checkAuthTokken(resetPasswordTokken, 'pass_reset');

    if (!verifiedTokken.isValid || !verifiedTokken.user) {
      return res.status(409).json({ error: verifiedTokken.message });
    }

    // Tokken Verified !

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const { user } = verifiedTokken;

    user.password = encryptedPassword;
    user.passwordUpdatedAt = new Date().toISOString();

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, fullName: user.fullName }, tokkenSecret, {
      expiresIn: '30d',
    });

    if (process.env.AUTH_COOKIE) {
      res.setHeader(process.env.AUTH_COOKIE, token);
      res.cookie(process.env.AUTH_COOKIE, token);
    }

    return res.status(200).json({ message: 'Your Password Was Reset Successfully !' });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { authTokken, newPassword, oldPassword } = req.body;
    const tokkenSecret = process.env.JWT_SECRET;

    if (!tokkenSecret) {
      return res.status(409).json({ error: 'Something Wierd Happend !' });
    }

    const verifiedTokken = await checkAuthTokken(authTokken);

    const { user } = verifiedTokken;

    if (!user) {
      return res.status(409).json({ error: 'User Not Found' });
    }

    const paswordsMatch = await bcrypt.compare(oldPassword, user.password);

    if (!paswordsMatch) {
      return res.status(409).json({ error: 'Sorry Password You Entered Was Not Correct !' });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    user.password = encryptedPassword;
    user.passwordUpdatedAt = new Date().toISOString();
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, fullName: user.fullName }, tokkenSecret, {
      expiresIn: '30d',
    });

    if (process.env.AUTH_COOKIE) {
      res.setHeader(process.env.AUTH_COOKIE, token);
      res.cookie(process.env.AUTH_COOKIE, token);
    }

    return res.status(200).json({ message: 'Your Password Was Reset Successfully !' });
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
};

export { login, signUp, verifyAuthTokken, verifyAuthTokkenAdmin, findUserByTokken, createAndSendResetPasswordUrl, resetPassword, changePassword };
