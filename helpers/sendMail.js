const nodemailer = require('nodemailer');


module.exports.sendMail = (email, subject, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'animehieu123@gmail.com',
    to: email,
    subject: subject,
    html: `
        <div style="font-family: sans-serif;">
          <h2>OTP xác thực của bạn là:</h2>
          <p style="font-size: 24px; font-weight: bold;">${otpCode}</p>
          <p>Mã này có hiệu lực trong 5 phút.</p>
        </div>
      `,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
};