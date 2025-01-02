
const user = require('../Models/Auth0')

    const AuthController = async(req,res)=>{

        const result = user.getAuth0AccessToken();
    }