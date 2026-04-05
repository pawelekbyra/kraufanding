import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[EmailService] RESEND_API_KEY is missing.');
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export class EmailService {
  private static async sendEmail(toEmail: string, templateName: string, language: 'pl' | 'en' = 'pl') {
    try {
      const resend = getResendClient();
      if (!resend) return;

      const template = await prisma.emailTemplate.findUnique({
        where: { name: templateName }
      });

      if (!template) {
        console.warn(`[EmailService] ${templateName} template not found in DB. Skipping email.`);
        return;
      }

      const subject = language === 'pl' ? template.subjectPl : template.subjectEn;
      const html = language === 'pl' ? template.bodyPl : template.bodyEn;

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
}
