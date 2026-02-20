import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({success: false, error: "Access denied. No token provided"});

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({success: false, error: "Access denied. Malformed token provided"});

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        //verified consists of id, issued time(iat), and expiration time(exp)
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, error: "Invalid or Expired Token." });
    }
}   

export default verifyToken;