const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const PORT = 8000;
const bcrypt = require('bcrypt')
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')
const cors = require('cors')
require('dotenv').config();
require('./db')
app.use(cors());
app.use(bodyParser.json());
app.use('/users',authRoutes)
app.use('/blogs' , blogRoutes)
app.get('/' , (req,res) =>{
    res.json({
        message : 'Welcome to the API'
    })
});

app.listen(PORT,()=>{
    console.log(`Server is running on port:${PORT}`)
})
