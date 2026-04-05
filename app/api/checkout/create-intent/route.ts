import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        error: "Unauthorized",
        message: "Twoja sesja wygasła. Zaloguj się ponownie, aby dokonać wpłaty."
      }, { status: 401 });
    }

    // Lazy Sync Fallback via Service
    await UserService.getOrCreateUser(userId);

    const body = await req.json();
    const { amount, currency, title, creatorId } = body;

    if (!amount || amount < 10) {
      return NextResponse.json({ error: `Minimum parameters (min. 10 ${currency || 'PLN'})` }, { status: 400 });
    }

    const paymentIntent = await PaymentService.createPaymentIntent({
      userId,
      amount,
      currency,
      title,
      creatorId,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("[STRIPE_INTENT_ERROR]", error);
    return NextResponse.json({
      error: "Internal Error",
      message: error.message || "Unknown error"
    }, { status: 500 });
  }
}
