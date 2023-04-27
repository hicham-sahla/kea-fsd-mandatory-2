const express = require('express');
const { sendEmail } = require('../utils/emailSender');

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { email } = req.body;

  try {
    await sendEmail(email);
    res.redirect('/');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
