import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[EmailService] RESEND_API_KEY is missing. Emails will not be sent.');
      return null;
    }
    console.log('[EmailService] Initializing Resend client.');
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export class EmailService {
  private static async sendEmail(toEmail: string, templateName: string, language: 'pl' | 'en' = 'pl', variables?: Record<string, string>) {
    console.log(`[EmailService] Attempting to send ${templateName} to ${toEmail} (${language})`);
    try {
      const resend = getResendClient();
      if (!resend) {
        console.warn('[EmailService] Resend client not available. Aborting send.');
        return;
      }

      let template = null;
      try {
        template = await prisma.emailTemplate.findUnique({
          where: { name: templateName }
        });
      } catch (dbError) {
        console.error(`[EmailService] DB error fetching ${templateName} template:`, dbError);
      }

      let subject: string;
      let html: string;

      if (!template) {
        console.warn(`[EmailService] ${templateName} template not found in DB. Using fallback content.`);
        // Fallback content for critical emails
        if (templateName === 'WELCOME') {
          subject = language === 'pl' ? 'Witaj w POLUTEK.PL!' : 'Welcome to POLUTEK.PL!';
          html = language === 'pl'
            ? '<h1>Siema!</h1><p>Dzięki za dołączenie do naszej społeczności.</p>'
            : '<h1>Hey!</h1><p>Thanks for joining our community.</p>';
        } else {
          console.warn(`[EmailService] No fallback for ${templateName}. Skipping.`);
          return;
        }
      } else {
        subject = language === 'pl' ? template.subjectPl : template.subjectEn;
        html = language === 'pl' ? template.bodyPl : template.bodyEn;
      }

      // Simple variable replacement
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          const placeholder = new RegExp(`{{${key}}}`, 'g');
          subject = subject.replace(placeholder, value);
          html = html.replace(placeholder, value);
        });
      }

      const { data, error } = await resend.emails.send({
        from: 'POLUTEK.PL <no-reply@polutek.pl>',
        to: [toEmail],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error(`[EmailService] Error sending ${templateName} email via Resend:`, error);
      } else {
        console.log(`[EmailService] ${templateName} email sent to ${toEmail} (${language})`);
      }
    } catch (e) {
      console.error(`[EmailService] Unexpected error sending ${templateName} email:`, e);
    }
  }

  static async sendWelcomeEmail(toEmail: string, language: 'pl' | 'en' = 'pl') {
    await this.sendEmail(toEmail, 'WELCOME', language);
  }

  static async sendAccountDeletedEmail(toEmail: string, language: 'pl' | 'en' = 'pl') {
    await this.sendEmail(toEmail, 'ACCOUNT_DELETED', language);
  }

  static async sendPasswordChangedEmail(toEmail: string, language: 'pl' | 'en' = 'pl') {
    await this.sendEmail(toEmail, 'PASSWORD_CHANGED', language);
  }

  static async sendDonationThankYouEmail(toEmail: string, amount: number, currency: string, language: 'pl' | 'en' = 'pl') {
    await this.sendEmail(toEmail, 'THANK_YOU_DONATION', language, {
      amount: amount.toFixed(2),
      currency: currency
    });
  }

  static async sendBecomePatronEmail(toEmail: string, language: 'pl' | 'en' = 'pl') {
    await this.sendEmail(toEmail, 'BECOME_PATRON', language);
  }
}
