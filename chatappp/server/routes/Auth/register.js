const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();



// import files
const Users = require('../../models/Users');


router.post('/api/register', async (req, res) => {

    const { fullName, email, password } = req.body;

    if(!fullName || !email || !password){
        return res.status(400).send('Please fill all required fields');
    }

    try {
        const isAlreadyExist = await Users.findOne({email});
            
        if(isAlreadyExist){
            return res.status(400).send('User already exists');
        } 

        const newUser = new Users({fullName, email});
        
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            try {
                newUser.set('password', hashedPassword);
                newUser.save();
            } catch (error) {
                console.log("Error at encrypting password: ", err);
            }
        });

        return res.send('User registered successfully')
        
    } catch (error) {
        console.log("error: ", error);
    }
});

module.exports = router;
