const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 3000;

// Define your email configuration
const emailConfig = {
  service: 'Gmail',
  auth: {
    user: process.env.Email,
    pass: process.env.APP_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

app.use(express.json());

app.use(cors());

app.post('/callback', (req, res) => {
  const { name, contactNumber, preferredCallbackTime, comments, to } = req.body;

  // Compose the email message
  const emailMessage = `
    Name: ${name || 'Not provided'}
    Contact Number: ${contactNumber}
    Preferred Callback Time: ${preferredCallbackTime || 'Not specified'}
    Comments/Questions: ${comments || 'None'}
  `;

  const mailOptions = {
    from: process.env.Email,
    to: to || "st17931@gmail.com",
    subject: 'Callback Request',
    text: emailMessage,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
