require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(toEmail) {
  const mailOptions = {
    from: 'info@hichamsahla.nl',
    to: toEmail,
    subject: 'Reset your password',
    text: 'Reset your password by clicking on the link in this e-mail',
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
}

module.exports = {
  sendEmail,
};
