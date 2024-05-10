'use server'
const nodemailer = require('nodemailer'); // 모듈 import

export async function sendEmail(message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // gmail을 사용함
    auth: {
      user: process.env.GMAIL_EMAIL, // 나의 (작성자) 이메일 주소
      pass: process.env.GMAIL_PASSWORD // 이메일의 비밀번호
    }
  });
  console.log(process.env.GMAIL_PASSWORD);
  const mailOptions = {
    from: process.env.GMAIL_EMAIL, // 작성자
    to: 'oyc0401@gmail.com', // 수신자
    subject: `[하늘인편] ${message.slice(0, 15)}`, // 메일 제목
    text: message // 메일 내용
  };

  const result = await transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  });

  return result;
}