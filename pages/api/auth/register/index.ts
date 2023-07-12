import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';

interface RequestBody {
  email: string;
  password: string;
}

interface ResponseData {
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body as RequestBody;
    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' });
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          password: await hash(password, 10),
        },
      });
      return res.status(200).json({ success: true });
    }
  }
}
