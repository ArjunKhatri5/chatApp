const mongoose = require('mongoose');

const url =  'mongodb+srv://chatApp_admin:AJaj1243@cluster0.lyf0vjg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(url)
.then(()=> console.log('connected to db'))
.catch((e)=> console.log("error", e));