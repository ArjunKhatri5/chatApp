// Note: backup file for app.js (no routes used);


// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const  app = express();


// // Connect db
// require('./db/connection')




// // import files
// const Users = require('./models/Users');
// const Conversation = require('./models/Conversation');
// const Messages = require('./models/Messages');

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cors());


// app.post('/api/register', async (req, res) => {

//     const { fullName, email, password } = req.body;

//     if(!fullName || !email || !password){
//         return res.status(400).send('Please fill all required fields');
//     }

//     try {
//         const isAlreadyExist = await Users.findOne({email});
            
//         if(isAlreadyExist){
//             return res.status(400).send('User already exists');
//         } 

//         const newUser = new Users({fullName, email});
        
//         bcrypt.hash(password, 10, (err, hashedPassword) => {
//             try {
//                 newUser.set('password', hashedPassword);
//                 newUser.save();
//             } catch (error) {
//                 console.log("Error at encrypting password: ", err);
//             }
//         });

//         return res.send('User registered successfully')
        
//     } catch (error) {
//         console.log("error: ", error);
//     }
// });











// app.post('/api/login', async (req, res)=>{

//     const { email, password } = req.body;

//     if(!email || !password){
//         return res.status(400).send('Please enter email and password');
//     }

//     try {
//         const user = await Users.findOne({email});
    
//         if(!user){
//             return res.status(400).send('User does not exist');
//         };
    
//         const validateUser = await bcrypt.compare(password, user.password);
    
//         if(!validateUser){
//             return res.status(400).send('Incorrect login details');
//         }
    
//         const payload = {
//             userId: user._id,
//             email: user.email
//         }
//         const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";  
    
//         jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: 84600}, async(err, token) => {
//             await Users.updateOne({ _id : user._id }, {
//                 $set: {token}
//             })
//             user.save();
//             res.status(200).json({ user: { id: user._id , email: user.email, fullName: user.fullName}, token: token });
//         } )
    
//     } catch (error) {
//         console.log("error: ", error);
//     }
// });










// creates/initiates a new conversation with people

// app.post('/api/conversation', async(req, res) => {
//     try {
//         const { senderId, receiverId } = req.body;

//         if(senderId === null || senderId === undefined ) return res.status(400).send("No senderId provided to create a new conversation")
//         if(receiverId === null || receiverId === undefined ) return res.status(400).send("No receiverId provided to create a new conversation")

        
//         const isAlreadyExists = await Conversation.findOne({
//             members: {
//                 $all: [senderId, receiverId]            // The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
//             }
//         });


//         if(isAlreadyExists){
//             return res.status(409).json({isAlreadyExists})
//         }

//         const newConvo = new Conversation({ members : [senderId, receiverId] });
//         await newConvo.save();
//         res.status(200).json(newConvo);
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// });





// displays all the people we have conversation with

// app.get('/api/conversations/:userId', async(req, res) => {
//     try {
//         const currentUsersId = req.params.userId;
//         const conversations = await Conversation.find({ members: { $in : [currentUsersId] } });   //$in = included?

//         const conversationUserData = await Promise.all(conversations.map(async(conversation) => {
//             let receiverId = conversation.members.find( (member) => member !== currentUsersId );
//             // receiverId will have the id of the other member that has a conversation with current user. 

//             const user = await Users.findById(receiverId);
//             return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id}
//         } ) )
//         res.status(200).json(conversationUserData);
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// });
// why Promise.all()?
// The await keyword is used within a .map() function, 
// which doesn't work as intended because map() doesn't wait for promises to resolve. 
// You can use Promise.all() to handle multiple asynchronous operations concurrently.










// app.post('/api/message', async(req, res) => {
//     try {
//         const {conversationId, senderId, message, receiverId = ''} = req.body;

//         if(!senderId || !message ) return res.status(400).send('No senderId or Message');


//         // if the conversation doesn't already exists, create a new one
//         if(conversationId === 'new' && receiverId){
//             const newConvo = new Conversation({ members : [senderId, receiverId]});
//             await newConvo.save();
//             const newMessage = new Messages({conversationId: conversation._id, senderId, message});
//             await newMessage.save();
//            res.status(200).send('Message Successfully sent!');
//         } else if(!conversationId && !receiverId){
//             return res.status(400).send('Please fill all the required fields')
//         }


//         const newMessage = new Messages({conversationId, senderId, message});
//         await newMessage.save();
//         return res.status(200).send('Message sent successfully!');
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// })










// app.get('/api/message/:conversationId', async(req, res) => {
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
