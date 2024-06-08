const express = require('express');

const  router = express.Router();


// import files
const Conversation = require('../../models/Conversation');


router.post('/api/conversation', async(req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if(senderId === null || senderId === undefined ) return res.status(400).send("No senderId provided to create a new conversation")
        if(receiverId === null || receiverId === undefined ) return res.status(400).send("No receiverId provided to create a new conversation")

        
        const isAlreadyExists = await Conversation.findOne({
            members: {
                $all: [senderId, receiverId]            // The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
            }
        });


        if(isAlreadyExists){
            return res.status(409).json({isAlreadyExists})
        }

        const newConvo = new Conversation({ members : [senderId, receiverId] });
        await newConvo.save();
        res.status(200).json(newConvo);
    } catch (error) {
        console.log("Error: ", error);
    }
});


module.exports = router;