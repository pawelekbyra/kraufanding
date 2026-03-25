import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user.service';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkUserId, email_addresses, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (clerkUserId && email) {
      await UserService.syncUser(clerkUserId, email, image_url);
      console.log(`User ${clerkUserId} synced via webhook.`);
    }
  }

  if (eventType === 'user.deleted') {
      const { id: clerkUserId } = evt.data;
      if (clerkUserId) {
          try {
              await UserService.softDeleteUser(clerkUserId);
              console.log(`User ${clerkUserId} soft-deleted/anonymized via webhook.`);
          } catch (e) {
              console.error(`Error soft-deleting user ${clerkUserId}:`, e);
          }
      }
  }

  return NextResponse.json({ success: true });
}
