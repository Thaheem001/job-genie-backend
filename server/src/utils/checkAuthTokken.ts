import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/user.model';

type DecryptedTokkenType = {
  email: string;
  fullname?: string;
  type?: string;
};

type VerifyAuthTokkenResult = {
  isValid: boolean;
  message: string;
  result?: DecryptedTokkenType;
  user?: UserDocument;
};

const checkAuthTokken = async (authTokken: string, typeCheck?: string) => {
  const result: VerifyAuthTokkenResult = {
    isValid: false,
    message: 'Tokken is Invalid',
    result: undefined,
  };

  try {
    const tokkenSecret = process.env.JWT_SECRET;


    if (!tokkenSecret || !authTokken) {
      return result;
    }

    const verifiedTokken: any = jwt.verify(authTokken, tokkenSecret);



    if ((typeCheck && !verifiedTokken?.type) || verifiedTokken?.type !== typeCheck) {
      result.message = 'Con not use this tokken for this perpouse!';
      return result;
    }



    if (!verifiedTokken?.email) {
      return result;
    }



    const user = await User.findOne({ email: verifiedTokken.email }).exec();

    if (!user || !user.enabled) {
      result.message = 'User Not Found!';
      return result;
    }

    if (!verifiedTokken?.exp || !verifiedTokken?.iat) {
      result.message = 'Tokken Expired !';
      return result;
    }

    const iat = new Date(verifiedTokken.iat * 1000);
    const passwordUpdatedAt = new Date(user.passwordUpdatedAt);

    if (passwordUpdatedAt > iat) {
      result.message = 'Tokken No longer Valid!';
      return result;
    }



    const exp = new Date(verifiedTokken?.exp * 1000);
    const now = new Date();

    if (now > exp) {
      result.message = 'Tokken Expired !';
      return result;
    }

    result.isValid = true;
    result.user = user;
    result.message = 'Tokken Verified Successfully';
    result.result = verifiedTokken;

    return result;
  } catch (error: any) {
    result.message = error.message;
    return result;
  }
};

export default checkAuthTokken;
