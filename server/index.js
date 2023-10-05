const express =require('express');
const dotenv= require('dotenv').config();
const cookieParser=require("cookie-parser")


const app=express();
require('./db/conn')

app.use(express.json())


//middleware
app.use(cookieParser());
// const middleware=(req,res,next)=>{
//     console.log('hello middle')
//     next();
// }

//Route


app.use(require('./router/auth'));

app.get('/',(req,res)=>{
    res.send('home');
})

// app.get('/register',(req,res)=>{
//     res.send('home');
// })
// app.get('/login',(req,res)=>{
//     res.send('home');
// })

app.listen(process.env.PORT,()=>{
    console.log(`server running at ${process.env.PORT}`);
})