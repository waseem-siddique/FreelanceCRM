const nodemailer = require('nodemailer');

async function test() {
  console.log("Starting SMTP test...");
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "waseemsiddiqueop@gmail.com",
        pass: "aoza nsxy iiat fufr"
      },
      connectionTimeout: 10000 // 10s
    });

    const info = await transporter.sendMail({
      from: "waseemsiddiqueop@gmail.com",
      to: "waseemsiddiqueop@gmail.com",
      subject: "SMTP Test",
      text: "Testing SMTP connection"
    });
    console.log("SUCCESS: Email sent:", info.messageId);
    process.exit(0);
  } catch (error) {
    console.error("FAILED to send email:");
    console.error(error);
    process.exit(1);
  }
}

test();
