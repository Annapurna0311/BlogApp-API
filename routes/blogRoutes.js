const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog')
const auth = require('../middleware/auth')


router.post('/createblog',auth , async(req,res)=>{
   const owner = req.user._id;
   const {title , blog} = req.body;
   try{
        const newblog = new Blog({
            title,
            blog,
            owner
        });
        await newblog.save();
        res.json({
            message :'Blog created successfull'
        });
   }catch(err){
        res.status(400).send({error:err});
   }
});

router.get('/getallblogs', async(req,res)=>{
    try{
        const blogs = await Blog.find({})
        res.json({
            message:'blogs fetching success',
            blogs
        });
    }
    catch(err){
        res.status(400).send({error:err});
    }
});
router.get('/getallblogs/:id',async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        res.json({
            message: 'Blog fetched!!',
            blog
        })
    }catch(err){
        res.status(400).send({error:err});
    }
});
router.patch('/updateblog/:id',auth ,async(req,res)=>{
    const {title , blog} = req.body;
    try{
        const newblog = await Blog.findOne({ _id:req.params.id,owner:req.user._id});
        if(!newblog){
            return res.status(400).json({
                message:'Blog not found'
            });
        }
        newblog.title = title;
        newblog.blog = blog;
        await newblog.save();

        res.json({
            message:'Blog updated!!'
        });
    }catch(err){
        return res.status(400).json({
            message : err.message
          });
    }
});
module.exports = router