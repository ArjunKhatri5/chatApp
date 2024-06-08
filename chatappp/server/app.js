const express = require('express');
const cors = require('cors');
const io = require('socket.io')(8000, {
    pingTimeout: 60000, // if the user doesn't sent a message within 60 seconds, it's gonna close the connection to save the bandwidth
    cors: {
        origin: 'http://localhost:5173'
    }
})

const  app = express();


// Connect db
require('./db/connection')




// import files
const Users = require('./models/Users');
// const Conversation = require('./models/Conversation');
// const Messages = require('./models/Messages');


// importing routes
const register = require('./routes/Auth/register');
const login = require('./routes/Auth/login')
const sendMessage = require("./routes/Messages/sendMessage");
const displayUserMessages = require("./routes/Messages/displayUserMessage");
const newConversation = require("./routes/Conversations/newConversation");
const existingConversations = require("./routes/Conversations/existingConversations");


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


// socket.io
let users = [];
io.on('connection', (socket) =>{
    // console.log('user connected', socket.id);
    socket.on('addUser', currentUsersId => {
        const isUserExist = users.find(user => user.currentUsersId === currentUsersId);
        console.log("isUserExist", isUserExist );
        if(!isUserExist){
            const user = {currentUsersId, socketId: socket.id, online: true};
            users.push(user);
            io.emit('getUsers', users)
            console.log("user didn't exist");
        }
    });


    console.log("user", users);

    // socket.on('sendMessage', async ({conversationId, senderId, message, receiverId}) => {
    socket.on("sendMessage", async ({conversationId, senderId, message, receiverId}) => {
        console.log('wassup', conversationId, senderId, message, receiverId );
        const receiver = users.find( user => user.currentUsersId === receiverId);
        const sender = users.find( user => user.currentUsersId === senderId);
        const user = await Users.findById(senderId);

        console.log("receiver", receiver)
        console.log("sender", sender)
        console.log("userrr", user)

        if(receiver){
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                conversationId,
                senderId,
                message,
                receiverId,
                user: { id:user._id, email: user.email, fullName: user.fullName }
            });
        } else {
            io.to(sender.socketId).emit('getMessage', {
                conversationId,
                senderId,
                message,
                receiverId,
                user: { id:user._id, email: user.email, fullName: user.fullName }
            })
        }
    })

    socket.on("disconnect", ()=>{
        users = users.filter(user => user.socketId !== socket.id);
        io.emit("getUsers", users);
        console.log("disconnect", users);
    });

    
});



app.use(register);
app.use(login);
app.use(newConversation);
app.use(existingConversations);
app.use(sendMessage);
app.use(displayUserMessages);



app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id : { $ne : userId }} );     // $ne = not equals
        
        const usersData = users.map( (user) => {
            return { user: {email : user.email, fullName: user.fullName}, userid: user._id }
        })

        res.status(200).json(usersData);
    } catch (error) {
        console.log("Error >>: ", error);
    }

});




const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})