const Admin = require('../admin/admin.schema');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const jwt_sercet = "caodonghavenoparty";

// send JWT token if pwd and username is correct.

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
            {expiresIn:'12h'});

        return res.status(200).send({message:"token sended succussfuly", token:token , username:admin.username});

    } catch (error) {
        console.error("fail to verify user", error);
        res.status(401).send({message:"fail to login in as admin"});
    }
})

module.exports = router;