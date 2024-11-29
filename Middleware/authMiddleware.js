const jwt = require('jsonwebtoken');
const secretKey = "nigga"; // Ideally, store this in environment variables

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove the "Bearer " part of the Authorization header if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    try {
        // Verify and decode the token
        const decoded = jwt.verify(tokenWithoutBearer, secretKey);

        // Attach the decoded user info to the request object
        req.user = decoded;

        // Call next middleware
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
