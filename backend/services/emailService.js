// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"SmartBook Support" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: '🔐 SmartBook Password Reset OTP',
    html: `
      <h3>Hello from SmartBook</h3>
      <p>Here is your one-time password (OTP) to reset your password:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 10 minutes. Please do not share it.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
