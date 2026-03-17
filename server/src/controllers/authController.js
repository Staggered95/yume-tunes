import { query } from '../config/db.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Helper function to generate tokens so we keep our code DRY!
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' } 
    );
    
    const refreshToken = jwt.sign(
        { id: userId }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' } 
    );

    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    try {
        const userCheck = await query("SELECT * FROM users WHERE username=$1 OR email=$2", [username, email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, error: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const text = `INSERT INTO users(first_name, last_name, username, email, password_hash)
                      VALUES ($1, $2, $3, $4, $5)
                      RETURNING id, username, email;`;
        
        const insertedUser = await query(text, [first_name, last_name, username, email, hashedPassword]);
        const user = insertedUser.rows[0];

        const { accessToken, refreshToken } = generateTokens(user.id);

        // 2. Send the Refresh Token in a secure, HTTP-Only cookie!
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, // Prevents JavaScript/XSS attacks from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
            sameSite: 'Strict', // Prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        // 3. Send the Access Token in the JSON body for React to use
        return res.status(201).json({ success: true, data: user, token: accessToken });
    } catch(err) {
        console.error("Registration error: ", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

const login = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username && !email) {
        return res.status(400).json({ success: false, error: "Either email or username must be present" });
    }
    
    const verity_placeholder = !username ? "email" : "username";
    const verity_values = !username ? [email] : [username];
    const verity_text = `SELECT * FROM users WHERE ${verity_placeholder} = $1;`;

    try {
        const userQuery = await query(verity_text, verity_values);
        
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ success: false, error: "No such user exists" });
        }
        
        const user = userQuery.rows[0];
        const verified = await bcrypt.compare(password, user.password_hash);

        if (verified) {
            // 1. Generate both tokens
            const { accessToken, refreshToken } = generateTokens(user.id);

            // 2. Send the Refresh Token in a secure, HTTP-Only cookie!
            res.cookie('jwt', refreshToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            // 3. Send the Access Token in the JSON body
            return res.status(200).json({ success: true, token: accessToken });
        } else {
            return res.status(400).json({ success: false, error: "Password mismatch" });
        }

    } catch (err) {
        console.error("Login error: ", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

const logout = (req, res) => {
    // Shred the cookie by clearing it!
    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'Strict', 
        secure: process.env.NODE_ENV === 'production' 
    });
    return res.status(200).json({ success: true, message: "Logged out completely" });
}

const me = async (req, res) => {
    try {
        const text = `
            SELECT id, first_name, last_name, username, email, user_image, role, created_at 
            FROM users 
            WHERE id = $1;
        `;
        
        const result = await query(text, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "User no longer exists" });
        }

        res.status(200).json({ 
            success: true, 
            data: result.rows[0] 
        });
    } catch (err) {
        console.error("Fetch Me Error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


const refresh = async (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.status(401).json({ success: false, error: "Unauthorized" });
    
    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const accessToken = jwt.sign(
            { id: decoded.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        res.json({ success: true, token: accessToken });
    } catch (err) {
        return res.status(403).json({ success: false, error: "Forbidden - Please log in again" });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(200).json({ success: true, message: 'If that email exists in our system, a reset link has been sent.' });
        }

        const user = userResult.rows[0];

        const secret = process.env.JWT_SECRET + user.password_hash;

        const payload = { email: user.email, id: user.id };
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });

        const frontendUrl = process.env.MAIN_URL;
            
        const resetLink = `${frontendUrl}/reset-password/${user.id}/${token}`;

        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #2a2a3a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                
                <div style="background-color: #1a1a2e; text-align: center; padding: 30px 20px; border-bottom: 2px solid #9D5CFA;">
                    <img src="https://res.cloudinary.com/ddc6silap/image/upload/mascot_ipgjzj.png" alt="YumeTunes Mascot" style="max-width: 120px; height: auto; margin-bottom: 15px;" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Yume<span style="color: #9D5CFA;">Tunes</span></h1>
                </div>

                <div style="padding: 40px 30px; color: #e0e0e0;">
                    <h2 style="color: #ffffff; font-size: 22px; margin-top: 0;">Password Reset Request</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Hello <strong style="color: #ffffff;">${user.username}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">We received a request to reset the password for your YumeTunes account. To proceed, please click the button below.</p>
                    
                    <div style="background-color: rgba(157, 92, 250, 0.1); border-left: 4px solid #9D5CFA; padding: 15px 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0; font-size: 14px; color: #e0e0e0;">⏱️ This link is securely encrypted and will expire in exactly <strong style="color: #9D5CFA;">15 minutes</strong>.</p>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetLink}" style="background-color: #9D5CFA; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Reset My Password</a>
                    </div>

                    <p style="font-size: 14px; color: #888888; line-height: 1.6; border-top: 1px solid #2a2a3a; padding-top: 25px;">
                        If you did not request a password reset, you can safely ignore this email. Your account remains completely secure and your password will not be changed.
                    </p>
                </div>

                <div style="background-color: #0a0a0a; text-align: center; padding: 25px 20px; color: #666666; font-size: 12px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} YumeTunes. All rights reserved.</p>
                    <p style="margin: 8px 0 0 0;">Your Personal Anime Music Sanctuary</p>
                </div>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'YumeTunes - Password Reset Request',
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'If that email exists in our system, a reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while attempting to send the email.' });
    }
};





export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    try {
        // 1. Find the user
        const userResult = await query('SELECT * FROM users WHERE id = $1', [id]);
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid reset link.' });
        }

        const user = userResult.rows[0];
        const secret = process.env.JWT_SECRET + user.password_hash;

        // 2. Verify the token
        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'This reset link has expired or has already been used.' });
        }

        // 🛡️ 3. NEW SECURITY CHECK: Prevent reusing the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Your new password cannot be the same as your current password.' 
            });
        }

        // 4. Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHashedPassword, id]);

        res.status(200).json({ success: true, message: 'Password has been successfully reset! You can now log in.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while resetting the password.' });
    }
};

export default { register, login, refresh, logout, me, forgotPassword, resetPassword };