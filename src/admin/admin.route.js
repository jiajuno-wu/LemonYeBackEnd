const Admin = require('../admin/admin.schema');
const express = require('express');
const jwt = require('jsonwebtoken');
const verifyAdminToken = require('../middleware/verfiyAdminToken');

const router = express.Router();

const jwt_sercet = "caodonghavenoparty";

// send JWT token if pwd and username is correct.
// login
router.post('/admin', async(req,res) => {
    try {
        console.log(req.body);
        const {username, password} = req.body;
        const admin = await Admin.findOne({username});
        if(!admin){
            res.status(404).send({message:"no admin found"});
        };
        if(admin.password !== password){
            res.status(401).send({message:"invalid password"});
        };

        // generate jwt token
        const token = jwt.sign({id:admin._id, username:admin.username}, 
            jwt_sercet, 
            {expiresIn:'24h'});

        
        // set cookie with security options
        res.cookie('token', token, {
            httpOnly : true, // prevents XSS attack
            secure : false,  // cookie will sent over http, need set true in production with SSL.
            sameSite : 'lax',
            maxAge : 24*60*60*1000 // 24 hour
        })


        return res.status(200).json({
            message: "login successful",
            username: admin.username
        })

    } catch (error) {
        console.error("fail to verify user", error);
        res.status(401).send({message:"fail to login in as admin"});
    }
})

router.post('/logout', (req,res) => {
    res.clearCookie('token');
    return res.json({message:'logged out successfully'});
})

router.get('/me', verifyAdminToken, (req,res)=>{
    return res.json({
        isAuthenticated:true,
        username : req.user.username
    })
})


module.exports = router;