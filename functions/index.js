const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

exports.sendMail = functions.https.onRequest((req, res) => {
  const { to, subject, text } = req.body;

  const msg = {
    to,
    from: 'ayelethury@gmail.com',
    subject,
    text,
  };

  sgMail.send(msg)
    .then(() => res.status(200).send('Email sent!'))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to send email');
    });
});
