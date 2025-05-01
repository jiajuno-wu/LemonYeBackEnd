const express = require('express');
const jwt_sercet = "caodonghavenoparty";

const verifyAdminToken = (req,res,next) =>{
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid credientials' });
        }
        // The user is the decoded payload of the JWT token
        req.user = user;
        next();
    })
}

module.exports = verifyAdminToken;