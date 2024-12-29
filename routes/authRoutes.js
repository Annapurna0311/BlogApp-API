const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'sarojanimishra058@gmail.com',
    pass : 'lvzvtydmggcojfop',
  }
});
router.get("/", (req, res) => {
  res.json({
    message: "User route is working",
  });
});
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) 
    {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isnotMatch = await bcrypt.compare(password, user.password);
    if (isnotMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY
    );
    res.json({
      token, user , message: "User logged in successfully"
    });
  } 
  catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post('/sendotp', async(req,res)=>{
  const {email} = req.body;
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' });
  
  const otp = Math.floor(10000 + Math.random() * 900000);
  const emailBody = `
    Dear ${email},
    
    You have requested for a new OTP to log on to the BLOGAPI website.
    
    Enter the following OTP to proceed.
    OTP: ${otp}
    (This OTP is generated at ${currentTime} IST and is valid for the next 10 minutes)
    
    Warm Regards,
    BLOGAPP team
    
    For any queries, write to us at blogapp@gmail.com or call us on 1800-209-3111.
    =====-----=====-----=====
    Notice: The information contained in this e-mail
    message and/or attachments to it may contain
    confidential or privileged information. If you are
    not the intended recipient, any dissemination, use,
    review, distribution, printing, or copying of the
    information contained in this e-mail message
    and/or attachments to it are strictly prohibited. If
    you have received this communication in error,
    please notify us by reply e-mail or telephone and
    immediately and permanently delete the message
    and any attachments. Thank you.
  `;
  try{
    const mailOptions = {
      from : '"BlogAPP" sarojanimishra058@gmail.com',
      to : email,
      subject : 'OTP for verification',
      text : emailBody,
    }

    transporter.sendMail(mailOptions, async(err , info)=>{
      if(err){
        res.status(500).json({
          message: err.message
        });
      }else{
        res.json({
          message: 'OTP sent successfully'
        });
      }
    })
  }catch(err){
    res.status(500).json({
      message : err.message
    });
  }
})
module.exports = router;
