import nodemailer from 'nodemailer';

const getOTPEmailTemplate = (otp) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4a90e2;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .otp-box {
          font-size: 32px;
          letter-spacing: 6px;
          margin: 20px 0;
          font-weight: bold;
          color: #4a90e2;
          border: 2px dashed #4a90e2;
          display: inline-block;
          padding: 12px 24px;
          border-radius: 8px;
          background-color: #f0f8ff;
        }
        .footer {
          font-size: 12px;
          color: #777;
          padding: 20px;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          font-size: 14px;
          background-color: #4a90e2;
          color: #ffffff;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Verify Your Email</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Use the following One-Time Password (OTP) to proceed:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <a href="#" class="button">Verify Now</a>
        </div>
        <div class="footer">
          <p>If you did not request this OTP, please ignore this message.</p>
          <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME} All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

const generateEmail = async (to, subject,otp) => {
  
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});
  const mailOptions = {
    from: `Zinkly -The Chat App 💬 <${process.env.EMAIL_FROM}>`,
    to:to,
    subject:subject,
    html: getOTPEmailTemplate(otp),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
export default generateEmail;