import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
   const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
         user: process.env.MAIL_USERNAME,
         pass: process.env.MAIL_PASSWORD,
      },
   });

   const mailOption = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: email,
      subject: "Mã OTP đổi mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
   };

   await transporter.sendMail(mailOption);
};
