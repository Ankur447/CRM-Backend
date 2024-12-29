const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Replace with your actual Auth0 domain and audience
const AUTH0_DOMAIN = 'dev-btad0jdv6jenv1st.us.auth0.com';
const AUDIENCE = 'https://dev-btad0jdv6jenv1st.us.auth0.com/api/v2/'; // Auth0 Audience
const EXEMPT_ROUTES = ['/api/login', '/api/register', '/api/doctorlogin', '/api/registerdoctor']; // Routes that don't require auth
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

// Auth middleware
const authMiddleware = (req, res, next) => {
  // Skip authentication for exempt routes
  if (EXEMPT_ROUTES.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('Unauthorized - No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract token from the Authorization header
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7) // Remove "Bearer " prefix
    : authHeader;

  // Decode the token for debugging and validation
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || !decodedToken.payload) {
    console.error('Invalid token structure or decoding failed');
    return res.status(403).json({ message: 'Invalid token structure' });
  }

  console.log('Decoded Token:', decodedToken); // Debugging decoded token

  // Check if the token is from Auth0 or custom login
  if (decodedToken.payload.iss && decodedToken.payload.iss.includes(AUTH0_DOMAIN)) {
    // Auth0 token verification
    jwt.verify(
      token,
      getKey,
      {
        audience: AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
      },
      (err, decoded) => {
        if (err) {
          console.error('Auth0 token verification failed:', err.message);
          return res.status(403).json({ message: 'Invalid or expired Auth0 token' });
        }
        console.log('Verified Auth0 Token:', decoded); // Debugging verified token
        req.user = decoded;
        next();
      }
    );
  } else {
    // Custom token verification
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Custom token verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid or expired custom token' });
      }
      console.log('Verified Custom Token:', decoded); // Debugging verified token
      req.user = decoded;
      next();
    });
  }
};

module.exports = authMiddleware;
