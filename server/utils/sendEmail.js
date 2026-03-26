const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Setup email data with unicode symbols
  const mailOptions = {
    from: `"FreelanceCRM Admin" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // Optional HTML body
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
