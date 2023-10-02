const mongoose=require('mongoose');
const dotenv= require('dotenv').config();

mongoose.connect(process.env.DB).then(()=>{
    console.log('DATABASE CONNECTED')
}).catch((err)=>{
    console.log('FAILED TO CONNECT DATABASE',err)
})
