const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userModel = require('./models/Users');
const postModel = require('./models/Posts');
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.uufd0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)

app.post('/api/register', async(req, res) => {
    console.log(req.body)
    try{
        await userModel.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        })
        res.json({ status: 'ok' })        
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email'})
    }
});

app.post('/api/login', async(req, res) => {
    const user = await userModel.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if(user) {

        const token = jwt.sign(
            {
                name: user.name,
                email: user.email, 
            }, 
            'secret123'
        )


        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }    
});

app.get('/api/welcome', async(req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await userModel.findOne({ email: email })

        return res.json({ status: 'ok', user_id: user._id, username: user.name})
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'Invalid token' })
    } 
});


app.post('/api/addPost', async(req, res) => {
    console.log(req.body)
    try{
        await postModel.create({
            post_desc: req.body.myPost,
            owner: req.body.user_id,
        })
        res.json({ status: 'ok' })
    }catch{
        res.json({ status: 'error', error: 'Could not add post !!'  })
    }
})

app.listen(3001, ()=> {
    console.log("Server connected at Port 3001..")
});