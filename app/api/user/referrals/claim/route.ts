import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { UserService } from '@/lib/services/user.service';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    // 1. Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, referredById: true }
    });

    if (!currentUser) {
        // Ensure user exists in local DB (sync from Clerk)
        await UserService.getOrCreateUser(userId);
    }

    if (currentUser?.referredById) {
      return NextResponse.json({ error: "User already referred" }, { status: 400 });
    }

    // 2. Find Referrer by referralCode or ID
    const referrer = await prisma.user.findFirst({
      where: {
        OR: [
          { referralCode: referralCode },
          { id: referralCode }
        ]
      }
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === userId) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // 3. Update in transaction
    const updatedReferrer = await prisma.$transaction(async (tx) => {
      // Link current user to referrer
      await tx.user.update({
        where: { id: userId },
        data: { referredById: referrer.id }
      });

      // Increment points for referrer
      const updated = await tx.user.update({
        where: { id: referrer.id },
        data: { referralPoints: { increment: 1 } }
      });

      // 4. Check for Patron status (5 points)
      if (updated.referralPoints >= 5) {
          // Check if already has enough paid or flag
          // Logic: set totalPaid to at least 5 to unlock Patron/VIP1 tier
          if (updated.totalPaid < 5) {
              await tx.user.update({
                  where: { id: referrer.id },
                  data: { totalPaid: 5 } // Unlock VIP1 via referrals
              });

              // Also sync to Clerk metadata for premium access if needed
              const client = await clerkClient();
              await client.users.updateUserMetadata(referrer.id, {
                  publicMetadata: {
                      isPatron: true,
                      unlockedViaReferral: true
                  }
              });
          }
      }

      return updated;
    });

    return NextResponse.json({
        success: true,
        referrerId: updatedReferrer.id,
        newPoints: updatedReferrer.referralPoints
    });

  } catch (err: any) {
    console.error('[REFERRAL_CLAIM_ERROR]', err);
    return NextResponse.json({ error: "Failed to claim referral", message: err.message }, { status: 500 });
  }
}
