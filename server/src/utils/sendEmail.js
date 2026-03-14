import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    // 1. Create the transporter with your Gmail credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `"YumeTunes Support" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};