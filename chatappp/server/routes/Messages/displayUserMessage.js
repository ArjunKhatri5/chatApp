const express = require('express');


const  router = express.Router();


// import files
const Users = require('../../models/Users');
const Messages = require('../../models/Messages');


// router.get('/api/message/:conversationId', async(req, res) => {
//     try {
//         const conversationId = req.params.conversationId;
//         if(conversationId === 'new') return res.status(200).json([]);

//         const messages = await Messages.find({conversationId});

//         const messageUserData = await Promise.all(messages.map( async (message) => {
//             const user = await Users.findById(message.senderId);
//             return { user : { id: user._id, email: user.email, fullName: user.fullName}, message: message.message}
//         } ))

//         res.status(200).json(messageUserData);
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// });

router.get('/api/message/:conversationId', async(req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if(conversationId === 'new') return res.status(200).json([]);

        const messages = await Messages.find({conversationId});

        const messageUserData = await Promise.all(messages.map( async (message) => {
            const user = await Users.findById(message.senderId);
            return { user : { id: user._id, email: user.email, fullName: user.fullName}, message: message.message}
        } ))

        res.status(200).json(messageUserData);
    } catch (error) {
        console.log("Error: ", error);
    }
});


module.exports = router;