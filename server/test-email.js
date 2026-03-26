require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  console.log("Testing email with:");
  console.log("User:", process.env.SMTP_USER);
  console.log("Pass:", process.env.SMTP_PASS ? "****" : "missing");
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"FreelanceCRM Admin" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to self
      subject: "Test Email from Backend",
      text: "This is a test to verify SMTP configuration.",
    });

    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

test();
