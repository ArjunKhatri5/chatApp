const express = require('express');

const  router = express.Router();


// import files
const Conversation = require('../../models/Conversation');
const Messages = require('../../models/Messages');


router.post('/api/message', async(req, res) => {
    try {
        const {conversationId, senderId, message, receiverId = ''} = req.body;

        if(!senderId || !message ) return res.status(400).send('No senderId or Message');


        // if the conversation doesn't already exists, create a new one
        if(conversationId === 'new' && receiverId){
            const newConvo = new Conversation({ members : [senderId, receiverId]});
            await newConvo.save();
            const newMessage = new Messages({conversationId: conversation._id, senderId, message});
            await newMessage.save();
           res.status(200).send('Message Successfully sent!');
        } else if(!conversationId && !receiverId){
            return res.status(400).send('Please fill all the required fields')
        }


        const newMessage = new Messages({conversationId, senderId, message});
        await newMessage.save();
        return res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.log("Error: ", error);
    }
});


module.exports = router;