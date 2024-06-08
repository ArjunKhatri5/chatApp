const express = require('express');

const  router = express.Router();


// import files
const Users = require('../../models/Users');
const Conversation = require('../../models/Conversation');


router.get('/api/conversations/:userId', async(req, res) => {
    try {
        const currentUsersId = req.params.userId;
        const conversations = await Conversation.find({ members: { $in : [currentUsersId] } });   //$in = included?

        const conversationUserData = await Promise.all(conversations.map(async(conversation) => {
            let receiverId = conversation.members.find( (member) => member !== currentUsersId );
            // receiverId will have the id of the other member that has a conversation with current user. 

            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id}
        } ) )
        res.status(200).json(conversationUserData);
    } catch (error) {
        console.log("Error: ", error);
    }
});

module.exports = router;

// why Promise.all()?
// The await keyword is used within a .map() function, 
// which doesn't work as intended because map() doesn't wait for promises to resolve. 
// You can use Promise.all() to handle multiple asynchronous operations concurrently.
