const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async ({ nama, email_comment, pesan }) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const mailOptions = {
    from: nama,
    to: 'pakrt556@gmail.com',
    replyTo: email_comment,     
    subject: 'Pesan dari Form NutriKidz',
    html: `
      <h3>Pesan dari Kontak</h3>
      <p><strong>Nama:</strong> ${nama}</p>
      <p><strong>Email:</strong> ${email_comment}</p>
      <p><strong>Pesan:</strong><br>${pesan}</p>
    `,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
};

module.exports = {
    sendEmail
}
