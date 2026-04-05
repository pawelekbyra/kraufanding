import { clerkClient } from '@clerk/nextjs/server';

export const getClerkClient = async () => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is missing');
  }
  return await clerkClient();
};
