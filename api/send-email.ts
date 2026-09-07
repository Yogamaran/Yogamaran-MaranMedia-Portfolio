import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

function loadLocalEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (val) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch (e) {
    // Ignore filesystem read errors in serverless environments
  }
}

export interface EmailPayload {
  projectType: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  phoneNumber?: string;
  fullPhoneNumber?: string;
  currencyCode?: string;
  currencySymbol?: string;
  currencyName?: string;
  budgetAmount?: string;
  budget: string;
  description: string;
}

export async function processSendEmail(payload: EmailPayload) {
  loadLocalEnv();
  const {
    projectType,
    name,
    email,
    phone,
    fullPhoneNumber,
    currencyCode,
    currencyName,
    budget,
    description,
  } = payload;

  const rawPhone = (fullPhoneNumber || phone || "").trim();
  const phoneDisplay = rawPhone ? rawPhone : "Not provided";

  const currencyDisplay =
    currencyName && currencyCode
      ? `${currencyName} (${currencyCode})`
      : (currencyCode || "");

  const submissionDate = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const autoReplyText = `Hi ${name},

Thank you for contacting Maran Media.

I've received your project enquiry and all the details you provided.

I'll personally review your requirements and get back to you within 5 hours.

Looking forward to working with you.

Best regards,
Yoga Maran
Maran Media
Freelance Video Editor
`;

  const autoReplyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0c0c; color: #e8e8e8; padding: 28px; border-radius: 12px; border: 1px solid #262626;">
      <h2 style="color: #F5A623; margin-top: 0; font-size: 20px;">Thank you for contacting Maran Media</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #ccc;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #ccc;">Thank you for contacting <strong>Maran Media</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #ccc;">I've received your project enquiry and all the details you provided.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #ccc;">I'll personally review your requirements and get back to you within 5 hours.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #ccc;">Looking forward to working with you.</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #222;">
        <p style="margin: 0; color: #fff; font-weight: bold; font-size: 15px;">Yoga Maran</p>
        <p style="margin: 4px 0 0; color: #F5A623; font-size: 13px; font-weight: 500;">Maran Media — Freelance Video Editor</p>
      </div>
    </div>
  `;

  const adminMailText = `NEW PROJECT ENQUIRY — MARAN MEDIA

Client Name:
${name}

Client Email:
${email}

WhatsApp / Contact Number:
${phoneDisplay}

Project Type:
${projectType}

Budget:
${budget}
${currencyDisplay ? `\nCurrency:\n${currencyDisplay}\n` : ""}
Project Brief:
${description}

Submitted:
${submissionDate}
`;

  const adminMailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f3f3f3; padding: 24px; border-radius: 12px; border: 1px solid #2a2a2a;">
      <h2 style="color: #F5A623; margin-top: 0; font-size: 22px;">NEW PROJECT ENQUIRY — MARAN MEDIA</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999; width: 210px;"><strong>Client Name:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-weight: 500;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>Client Email:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;"><a href="mailto:${email}" style="color: #F5A623; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>WhatsApp / Contact Number:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-weight: 500;">${phoneDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>Project Type:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-weight: 500;">${projectType}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>Budget:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-weight: bold;">${budget}</td>
        </tr>
        ${
          currencyDisplay
            ? `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>Currency:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-weight: 500;">${currencyDisplay}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;"><strong>Submitted:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #aaa;">${submissionDate}</td>
        </tr>
      </table>
      <div style="margin-top: 20px;">
        <strong style="color: #999; display: block; margin-bottom: 8px;">Project Brief:</strong>
        <div style="background: #181818; padding: 16px; border-radius: 8px; color: #e5e5e5; white-space: pre-wrap; line-height: 1.6; border: 1px solid #2a2a2a;">${description}</div>
      </div>
    </div>
  `;

  // ── 1. Resend API Provider (if RESEND_API_KEY is configured) ──
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
    
    // Send admin email
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Maran Media Website <${resendFrom}>`,
        to: ["maranmedia18@gmail.com"],
        reply_to: email,
        subject: "NEW PROJECT ENQUIRY — MARAN MEDIA",
        html: adminMailHtml,
        text: adminMailText,
      }),
    });

    if (!adminRes.ok) {
      const errData = await adminRes.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to send email via Resend");
    }

    // Send client auto-reply
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Yoga Maran | Maran Media <${resendFrom}>`,
        to: [email],
        subject: "Thank you for contacting Maran Media",
        html: autoReplyHtml,
        text: autoReplyText,
      }),
    }).catch((e) => console.warn("Client auto-reply failed:", e));

    return { success: true, provider: "resend" };
  }

  // ── 2. SMTP Provider (Nodemailer via Gmail App Password) ──
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "maranmedia18@gmail.com";
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = smtpPort === 465;

  if (!smtpPass) {
    throw new Error(
      "EMAIL_CREDENTIALS_MISSING: SMTP_PASS is not configured in .env. Please add your 16-character Gmail App Password to .env to enable email delivery."
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass.replace(/\s+/g, ""),
    },
  });

  const adminMail = {
    from: `"Maran Media Website" <${smtpUser}>`,
    to: "maranmedia18@gmail.com",
    replyTo: email,
    subject: "NEW PROJECT ENQUIRY — MARAN MEDIA",
    text: adminMailText,
    html: adminMailHtml,
  };

  const clientMail = {
    from: `"Yoga Maran | Maran Media" <${smtpUser}>`,
    to: email,
    subject: "Thank you for contacting Maran Media",
    text: autoReplyText,
    html: autoReplyHtml,
  };

  await Promise.all([
    transporter.sendMail(adminMail),
    transporter.sendMail(clientMail),
  ]);

  return { success: true, provider: "smtp" };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload: EmailPayload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const result = await processSendEmail(payload);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Email delivery error:", error);
    return res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
