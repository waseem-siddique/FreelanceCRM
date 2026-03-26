const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // DEMO MODE: Prevent actual email sending to bypass Render's port blocks.
    console.log(`[DEMO MODE] Email intended for ${options.email} blocked. Subject: ${options.subject}`);
    return { messageId: 'demo-mode-no-email-sent' };
    
    // Create a reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.smtp2go.com', // fallback to SMTP2GO
      port: process.env.SMTP_PORT || 2525,               // 2525 is open on Render
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Setup email data with unicode symbols
    const mailOptions = {
      from: `"FreelanceCRM" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
