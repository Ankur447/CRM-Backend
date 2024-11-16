const User = require('../Models/User');

const Login = (req, res) => {
    const { email, password } = req.body;

    User.login({ email, password }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error in login", error: err });
        }
        
        if (result && result.token) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
};

module.exports = { Login };
