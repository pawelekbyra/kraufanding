import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { EmailService } from '@/lib/services/email.service';
import { prisma } from '@/lib/prisma';

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
    const { id, email_addresses, image_url, first_name, last_name, unsafe_metadata, public_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || null;
    const referrerId = unsafe_metadata?.referrerId as string | undefined;
    const preferredLanguage = public_metadata?.preferredLanguage as string | undefined;

    if (id && email) {
      const user = await UserService.syncUser(id, email, name, image_url, referrerId, preferredLanguage);
      console.log(`User ${id} synced via webhook. Referrer: ${referrerId || 'None'}, Language: ${preferredLanguage || 'Default'}`);

      if (eventType === 'user.created') {
        // Send welcome email in user's preferred language (defaults to "pl" if not set)
        await EmailService.sendWelcomeEmail(email, user.preferredLanguage as 'pl' | 'en' || 'pl');
      }
    }
  }

  if (eventType === 'user.deleted') {
      const { id } = evt.data;
      if (id) {
          try {
              // Try to find user before soft-deleting to get their email and language
              const user = await prisma.user.findUnique({
                  where: { id },
                  select: { email: true, preferredLanguage: true }
              });

              await UserService.softDeleteUser(id);
              console.log(`User ${id} soft-deleted/anonymized via webhook.`);

              if (user && user.email && !user.email.startsWith('deleted_')) {
                  await EmailService.sendAccountDeletedEmail(user.email, user.preferredLanguage as 'pl' | 'en' || 'pl');
              }
          } catch (e) {
              console.error(`Error soft-deleting user ${id}:`, e);
          }
      }
  }

  if (eventType === 'user.updated') {
      // Logic for password changes or other updates
  }

  // Specifically handle password updates if the event is enabled in Clerk dashboard
  // The event 'email_address.updated' or 'user.updated' can carry metadata about security changes.
  // Many developers use the 'user.updated' event and check if password hash changed (if available)
  // or simply notify on any update if security is a concern.

  // Specifically handle password updates if the event is enabled in Clerk dashboard
  if (eventType === 'session.created') {
      // Just an example, not directly requested.
  }

  return NextResponse.json({ success: true });
}
