import { createTransport } from "nodemailer";
import {
  accountCreationTemplate,
  passwordResetTemplate,
} from "../templates/email.template.js";
import dotenv from "dotenv";
import { EMAIL } from "../constants.js";

dotenv.config();

const password = process.env.EMAIL_PASS;

const transporter = createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: EMAIL,
    pass: password,
  },
  secure: true,
});

export const sendEmail = async (to, subject, html) => {
  const mailData = {
    from: EMAIL, // sender address
    to: to, // list of receivers
    subject: subject,
    text: "That was easy!",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailData);
    return info;
  } catch (err) {
    console.error(err);
    throw new Error("Could not send email");
  }
};

export const sendPasswordResetEmailService = async (email, name, link) => {
  try {
    const html = passwordResetTemplate(link, name);
    const result = await sendEmail(email, "Reset Your Password", html);
    return result;
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

export const sendAccountCreationEmailService = async (email, name, link) => {
  try {
    const html = accountCreationTemplate(link, name);
    const result = await sendEmail(
      email,
      "Your Account Has Been Created - Set Your Password",
      html
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to send account creation email: ${error.message}`);
  }
};
