const jwt = require('jsonwebtoken');
const jwt_sercet = "caodonghavenoparty";

const verifyAdminToken = (req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Access Denied. No token provided' , isAuthenticated: false});
    }

    jwt.verify(token, jwt_sercet, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid credientials' , isAuthenticated: false});
        }
        // The user is the decoded payload of the JWT token
        req.user = user;
        next();
    })
}

module.exports = verifyAdminToken;