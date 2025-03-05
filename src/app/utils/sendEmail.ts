import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { loadEmailTemplate } from './loadEmailTemplate';

export const sendEmail = async (to: string, subject: string, templateName: string, replacements: { [key: string]: string }) => {
    const htmlContent = loadEmailTemplate(templateName, replacements);


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'web.moniruzzaman1@gmail.com',
            pass: 'vaaj rsoe mppc elde',
        },
    });

    const mailOptions = {
        from: 'web.moniruzzaman1@gmail.com',
        to,
        subject: 'Reset your password within ten minutes!',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};
