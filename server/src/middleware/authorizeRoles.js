import { query } from '../config/db.js';

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const text = 'SELECT role FROM users WHERE id = $1';
            const result = await query(text, [userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: "User not found" });
            }

            const userRole = result.rows[0].role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    success: false, 
                    error: `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}` 
                });
            }

            next();
            
        } catch (err) {
            console.error("Role verification error:", err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    };
};

export default authorizeRoles;