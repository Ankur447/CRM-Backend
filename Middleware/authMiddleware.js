const jwt = require('jsonwebtoken');
const secretKey = "nigga"; // Replace this with an environment variable for security
const exemptRoutes = ['/api/login', '/api/register'];

const authMiddleware = (req, res, next) => {
    if (exemptRoutes.includes(req.path)) {
        return next(); // Skip authentication for exempt routes
    }

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

        // Call the next middleware or route handler
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }

};

module.exports = authMiddleware;
