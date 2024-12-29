const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const auth = require('../Models/Auth0');

const Login = async (req, res) => {
  const secretKey = "nigga"; // Replace with a secure key from environment variables
  const user = req.body;
  console.log(user);
  let token;

  try {
    let result;

    if (user.loginType === 'custom') {
      // Perform custom login
      result = await User.login(user);

      if (result && result.status === 200) {
        // Generate JWT for custom login
        token = jwt.sign(
          { id: result.user.id, email: result.user.email, role: "user" },
          secretKey,
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.status(200).json({ message: "Logged in", token, result });
      } else {
        throw new Error("Invalid credentials for custom login");
      }
    }

    if (user.loginType === 'auth0') {
      // Validate Auth0 token
      token = await auth.getAuth0AccessToken(); // Pass user token to validate it

      if (token) {
        // Example: Verify token or get user details from Auth0 API
        
        return res.status(200).json({ message: "Logged in with Auth0", token, result });
      } else {
        throw new Error("Invalid Auth0 token");
      }
    }

    throw new Error("Invalid login type");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

module.exports = { Login };
