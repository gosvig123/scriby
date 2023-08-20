`use server`;

import { User } from '@prisma/client';

export default function postUserToDatabase(
  user: User,
  provider: string
) {
  return true;
}
