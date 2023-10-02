const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate=require('../middleware/authenticate')

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send(`home`);
})
///USING PROMISES

// router.post('/register', async(req, res) => {
//     const { name, email, phone, password, cpassword } = req.body;
//     if (!name || !email || !phone || !password || !cpassword) {
//         return res.status(422).json({ error: "empty feild" })
//     }
//     User.findOne({ email: email }).then((userExists) => {
//         if(userExists) {
//             return res.status(422).json({ error: 'Email already exist' });
//         }
//         const user= new User({name:name, email:email, phone:phone, password:password, cpassword:cpassword});
//         user.save().then(()=>{
//             res.status(201).json({message:'User registerd successfully'})
//         }).catch(err=>res.status.json({error:'Failed to register'}))
//     }).catch(err=>{console.log(err)})

// });

//using async and awwait
router.post('/register', async (req, res) => {
    const { name, email, phone, work,password, cpassword } = req.body;
    if (!name || !email || !phone ||!work || !password || !cpassword) {
        return res.status(422).json({ error: "empty feild" })
    }

    try {

        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(422).json({ error: 'Email already exist' });
        } else if (password != cpassword) {
            return res.status(422).json({ error: 'Email already exist' });
        } else {
            const user = new User({ name: name, email: email, phone: phone,work:work, password: password, cpassword: cpassword });

            const userreg = await user.save();
            if (userreg) {
                res.status(201).json({ message: 'User registerd successfully' });
            } else {
                res.status.json({ error: 'Failed to register' })
            }
        }

    } catch (error) {
        console.log(error);
    }

});


//check login 
router.post('/login', async (req, res) => {
    // console.log(req.body);
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please fill the data" })
        }
        const userLogin = await User.findOne({ email:email });

        // console.log(userLogin)
        if(userLogin){
            const ismatch=await bcrypt.compare(password,userLogin.password);
            token=await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            })
        if (!ismatch) {
            res.status(400).json({ message: 'Invalid Credentialp' });
        } else {
            res.json({ message: 'login successful' });
        }
        }else{
            res.status(400).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err);
    }
})
//
router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
//logout
router.get('/logout',authenticate,(req,res)=>{
    res.clearCookie(('jwtoken'))
    console.log("cookie clear");
    res.status(200).send('user logout');
})
module.exports = router;

