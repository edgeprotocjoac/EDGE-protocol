import nodemailer, { Transporter } from 'nodemailer';

export interface SendOtpOptions {
  to: string;
  otpCode: string;
  name?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
    return transporter;
  }

  return null;
}

export async function sendVerificationOtpEmail({ to, otpCode, name }: SendOtpOptions): Promise<boolean> {
  const fromName = process.env.SMTP_FROM_NAME || 'EDGE Protocol';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@edgeprotocol.tech';
  const from = `"${fromName}" <${fromEmail}>`;

  const subject = `EDGE Protocol - Your Verification Code: ${otpCode}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EDGE Protocol Email Verification</title>
</head>
<body style="background-color: #0b0e14; margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #121824; border: 1px solid #1e293b; border-radius: 20px; padding: 36px 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Branding Header -->
    <div style="margin-bottom: 24px;">
      <h1 style="color: #22c55e; font-size: 24px; font-weight: 900; letter-spacing: 2px; margin: 0; padding: 0;">
        EDGE PROTOCOL
      </h1>
      <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
        Robinhood Chain Verified Trading
      </p>
    </div>

    <div style="border-top: 1px solid #1e293b; margin: 20px 0;"></div>

    <!-- Main Message -->
    <h2 style="color: #f8fafc; font-size: 20px; font-weight: 700; margin-bottom: 12px;">
      Verify Your Email Address
    </h2>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
      Welcome ${name ? `<strong>${name}</strong>` : ''}! Use the 6-digit OTP code below to complete your registration and activate your account.
    </p>

    <!-- OTP Code Box -->
    <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%); border: 1px solid #22c55e; border-radius: 16px; padding: 20px 32px; display: inline-block; margin: 12px 0 28px 0;">
      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #22c55e; margin-left: 12px;">
        ${otpCode}
      </span>
    </div>

    <!-- Notice Footer -->
    <p style="color: #64748b; font-size: 12px; line-height: 1.4; margin: 0;">
      This verification code is valid for 15 minutes.<br>
      If you did not create an account on EDGE Protocol, please ignore this email.
    </p>
    
    <div style="border-top: 1px solid #1e293b; margin: 24px 0 16px 0;"></div>
    
    <p style="color: #475569; font-size: 11px; margin: 0;">
      &copy; ${new Date().getFullYear()} EDGE Protocol. Verified Prediction Markets on Robinhood Chain.
    </p>
  </div>
</body>
</html>
  `;

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      await activeTransporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] ✅ Custom EDGE Protocol verification OTP email sent to ${to}`);
      return true;
    } catch (err) {
      console.error(`[EmailService] ❌ Failed to send SMTP email:`, err);
    }
  }

  // Fallback logging for local/dev environments without SMTP credentials
  console.log(`\n==================================================`);
  console.log(`[EMAIL SERVICE] 📧 EDGE PROTOCOL VERIFICATION EMAIL`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`OTP CODE: >>> ${otpCode} <<<`);
  console.log(`==================================================\n`);
  return true;
}
