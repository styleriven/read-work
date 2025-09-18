import getMailTemplate from "@/lib/email-templates";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

class EmailAction {
  async sendEmail(to: string, subject: string, content: string) {
    try {
      const msg = { from: process.env.EMAIL_FROM, to, subject, html: content };
      await transport.sendMail(msg);
    } catch (error) {
      console.log("Error sending email:", error);
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    // Implementation for sending email
    const content = getMailTemplate("emailVerification");
    if (content) {
      await this.sendEmail(email, content.subject, content.html({ code }));
    } else {
      console.error("Email template 'emailVerification' not found.");
    }
  }

  async sendResetPasswordEmail(to: string, code: string) {
    const content = getMailTemplate("resetPassword");
    if (content) {
      await this.sendEmail(to, content.subject, content.html({ code }));
    } else {
      console.error("Email template 'resetPassword' not found.");
    }
  }
}

export default new EmailAction();
