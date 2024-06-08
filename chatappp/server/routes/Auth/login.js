const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();

// import files
const Users = require('../../models/Users');


router.post('/api/login', async (req, res)=>{

    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).send('Please enter email and password');
    }

    try {
        const user = await Users.findOne({email});
    
        if(!user){
            return res.status(400).send('User does not exist');
        };
    
        const validateUser = await bcrypt.compare(password, user.password);
    
        if(!validateUser){
            return res.status(400).send('Incorrect login details');
        }
    
        const payload = {
            userId: user._id,
            email: user.email
        }
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";  
    
        jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: 84600}, async(err, token) => {
            await Users.updateOne({ _id : user._id }, {
                $set: {token}
            })
            user.save();
            res.status(200).json({ user: { id: user._id , email: user.email, fullName: user.fullName}, token: token });
        } )
    
    } catch (error) {
        console.log("error: ", error);
    }
});


module.exports = router;