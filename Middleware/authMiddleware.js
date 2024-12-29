const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Replace with your actual Auth0 domain and audience
const AUTH0_DOMAIN = 'dev-btad0jdv6jenv1st.us.auth0.com';  // Example: 'dev-xyz123.auth0.com'
const AUDIENCE = 'XgU5lrQZVLmmNo4Hx04zhg6VLFlPJpFa'; // Auth0 Audience
const EXEMPT_ROUTES = ['/api/login', '/api/register']; // Routes that don't require auth
const SECRET_KEY = 'nigga'; // Replace with a secure key in production (use env variables)


const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// Function to get the signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Verify Token
function verifyToken(token) {
  jwt.verify(
    token,
    getKey,
    {
      audience: 'YOUR_AUDIENCE', // Replace with your API identifier
      issuer: `https://${AUTH0_DOMAIN}/`,
    },
    (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
      } else {
        console.log('Token is valid:', decoded);
      }
    }
  );
}

// Example usage


// Auth middleware
const authMiddleware = (req, res, next) => {
    // Skip authentication for exempt routes
    if (EXEMPT_ROUTES.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.error("Unauthorized - No token provided");
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract token from the Authorization header
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) // Remove "Bearer " prefix
        : authHeader;

    console.log("Authorization Header Token:", token); // Debugging token

    // Verify and decode the token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            if(token){
                verifyToken(token)
            }else{
                return res.status(403).json({ message: "Invalid or expired token" });

            }
        }

        // Attach user data to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authMiddleware;
