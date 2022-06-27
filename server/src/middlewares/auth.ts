import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const tokkenSecret = process.env.JWT_SECRET;

  if (!tokkenSecret) {
    return res.status(404).json({ message: `Something went very wrong!` });
  }

  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    jwt.verify(token, tokkenSecret);
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default authenticate;
