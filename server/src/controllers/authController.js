import { query } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Helper function to generate tokens so we keep our code DRY!
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' } // Very short lifespan!
    );
    
    const refreshToken = jwt.sign(
        { id: userId }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' } // Logs them out after 7 days of inactivity
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

        // 1. Generate both tokens
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
        // req.user.id comes directly from the verifyToken middleware.
        // We select everything EXCEPT the password_hash.
        const text = `
            SELECT id, first_name, last_name, username, email, user_image, role, created_at 
            FROM users 
            WHERE id = $1;
        `;
        
        const result = await query(text, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "User no longer exists" });
        }

        // Send the clean user profile back to the frontend
        res.status(200).json({ 
            success: true, 
            data: result.rows[0] 
        });
    } catch (err) {
        console.error("Fetch Me Error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


// NEW: The Refresh Endpoint! React will call this quietly when the 15m token dies.
const refresh = async (req, res) => {
    // Note: You will need to `npm install cookie-parser` and add it to your Express app!
    const cookies = req.cookies;
    
    // If there is no cookie, they are completely logged out.
    if (!cookies?.jwt) return res.status(401).json({ success: false, error: "Unauthorized" });
    
    const refreshToken = cookies.jwt;

    try {
        // Verify the refresh token is still valid
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Give them a fresh 15-minute VIP pass!
        const accessToken = jwt.sign(
            { id: decoded.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        res.json({ success: true, token: accessToken });
    } catch (err) {
        // If the refresh token is expired or tampered with, force them to log in again.
        return res.status(403).json({ success: false, error: "Forbidden - Please log in again" });
    }
}

export default { register, login, refresh, logout, me };