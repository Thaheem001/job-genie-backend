import { Request, Response } from 'express';
import { Challenge, ChallengeDocument } from '../models/challenge.model';

const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const allChallenges = await Challenge.find().exec();

    return res.status(200).json({ data: allChallenges });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;

    await Challenge.findByIdAndDelete(challengeId).exec();

    return res.status(200).json({ data: 'deleted Successfuly' });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { desc, level, price, title, type }: ChallengeDocument = req.body;

    const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, { title, price, type, level, desc }).exec();

    return res.status(200).json({ data: updatedChallenge, message: 'updated successfuly' });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

type AddChallengeBody = {
  challenge: ChallengeDocument;
};

const addChallenge = async (req: Request, res: Response) => {
  try {
    const { challenge }: AddChallengeBody = req.body;

    const addedChallenge = await Challenge.create({ ...challenge });

    return res.status(200).json({ data: addedChallenge });
  } catch (error) {
    return res.status(409).json({ error });
  }
};
// get single challenge api
const getSingleChallnge = async (req: Request, res: Response) => {
  const { challengeId }: any = req.body;

  try {
    const singleChallenge = await Challenge.findById(challengeId);

    // console.log(singleChallenge);
    return res.status(200).json({ data: singleChallenge });
  } catch (error) {
    return res.status(409).json({ error });
  }
};

export { getAllChallenges, addChallenge, getSingleChallnge, deleteChallenge, updateChallenge };
