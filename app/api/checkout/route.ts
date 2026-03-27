import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    error: "Method Not Allowed",
    message: "Proszę użyć metody POST, aby wygenerować nową sesję płatności. Żądania GET są blokowane ze względu na cache."
  }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;
    try {
        const authData = auth();
        userId = authData.userId;
    } catch (e: any) {
        console.error("[Checkout] Clerk Handshake Failed:", e.message);
        return NextResponse.json({
            error: "CLERK_ERROR",
            message: "Błąd weryfikacji sesji (Clerk Handshake). Sprawdź klucze API CLERK_SECRET_KEY i NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY w panelu Vercel. Muszą pochodzić z tego samego projektu."
        }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({
        error: "Unauthorized",
        message: "Twoja sesja wygasła. Zaloguj się ponownie, aby dokonać wpłaty."
      }, { status: 401 });
    }

    // Lazy Sync Fallback via Service
    await UserService.getOrCreateUser(userId);

    const body = await req.json();
    const { amount, title, creatorId } = body;

    if (!amount || amount < 5) {
      return NextResponse.json({ error: "Minimum parameters (min. 5 PLN)" }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    const session = await PaymentService.createCheckoutSession({
      userId,
      amount,
      title,
      creatorId,
      successUrl: `${appUrl}/?success=true`,
      cancelUrl: `${appUrl}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json({
      error: "Internal Error",
      message: error.message || "Unknown error"
    }, { status: 500 });
  }
}
