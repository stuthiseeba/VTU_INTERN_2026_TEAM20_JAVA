import nodemailer from 'nodemailer';

export const sendMail = async (to, message) => {
    console.log("Mock email sent to:", to);
    console.log("Message:", message);
};
