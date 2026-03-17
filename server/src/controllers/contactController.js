import {sendEmail} from '../utils/sendEmail.js';

export const submitContactForm = async (req, res) => {
    const { name, email, type, message } = req.body;

    if (!name || !email || !type || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #e0e0e0; padding: 30px; border-radius: 10px; border: 1px solid #9D5CFA;">
                <h2 style="color: #ffffff; margin-top: 0; border-bottom: 2px solid #9D5CFA; padding-bottom: 10px;">
                    New YumeTunes ${type}
                </h2>
                <p><strong>From:</strong> ${name} (<a href="mailto:${email}" style="color: #9D5CFA;">${email}</a>)</p>
                <p><strong>Category:</strong> <span style="background-color: #9D5CFA; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${type}</span></p>
                
                <div style="background-color: #121212; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #9D5CFA; white-space: pre-wrap;">
                    ${message}
                </div>
            </div>
        `;

        await sendEmail({
            to: process.env.EMAIL_USER, 
            subject: `[YumeTunes ${type}] from ${name}`,
            text: message,
            html: htmlContent,
            replyTo: email 
        });

        res.status(200).json({ success: true, message: 'Message sent successfully. We will get back to you soon!' });
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};