import { Request, Response } from 'express';
import axios from 'axios';

type RepoInfo = {
  repoName: string;
  repoUrls: string;
  repoDesc: string;
  ownerImage: string;
  ownerName: string;
  ownerUrl: string;
  repoLanguage: string;
};

const getRepo = async (req: Request, res: Response) => {
  try {
    const api = `https://api.github.com/repos/DaudSamim/JS_Job_Genie_Dashboard`;
    const { data: result }: any = await axios.get(api);

    const repoInfo: RepoInfo = {
      ownerImage: result.owner.avatar_url,
      ownerUrl: result.owner.url,
      ownerName: result.owner.login,
      repoName: result.name,
      repoDesc: result.description,
      repoLanguage: result.language,
      repoUrls: result.html_url,
    };

    return res.status(200).json({ message: 'success', data: repoInfo });
  } catch (error) {
    console.log('Error is -->', error);
    return res.status(404).json({ message: 'fail', error });
  }
};

export { getRepo };
