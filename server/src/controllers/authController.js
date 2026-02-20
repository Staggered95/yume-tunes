import { query } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const text = `INSERT INTO users(first_name, last_name, username, email, password_hash)
                      VALUES ($1, $2, $3, $4, $5)
                      RETURNING id, username, email;`;
        const values = [first_name, last_name, username, email, hashedPassword];

        const insertedUser = await query(text, values);
        const token = jwt.sign({id: insertedUser.rows[0].id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(201).json({ success: true, data: insertedUser.rows[0], token: token });
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
        const user = await query(verity_text, verity_values);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ success: false, error: "No such user exists" });
        }
        
        const dbPasswordHash = user.rows[0].password_hash;
        const verified = await bcrypt.compare(password, dbPasswordHash);

        if (verified) {
            const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ success: true, token: token });
        } else {
            return res.status(400).json({ success: false, error: "Password mismatch" });
        }

    } catch (err) {
        console.error("Login error: ", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

export default { register, login };