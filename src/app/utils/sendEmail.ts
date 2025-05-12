import nodemailer from 'nodemailer';
import config from '../config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: Number(config.smtp.port),
  secure: false,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
} as SMTPTransport.Options);

export const sendEmail = async (email: string, html: string) => {
  await transporter.sendMail({
    from: `EcoRoots <${config.smtp.user}>`,
    to: email,
    subject: 'Reset Your Think Greenly Password!',
    html: html,
  });
};
