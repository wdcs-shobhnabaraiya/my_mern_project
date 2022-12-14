
const express=require('express')
const router =express.Router();
const auth=require('../middleware/auth');
const postModel = require('../models/post-model');
const profileModel = require('../models/profile-model');
const userModel = require('../models/user-model');
const { validatePostDetail,validatePostCommentDetail } = require('../validation/post-validation');

//@route POST api/addpost
//@desc add posts
//@access Private

router.post('/addpost',auth,async(req,res)=>{
  
    const { error } = validatePostDetail(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    try {
            const user =await userModel.findById(req.user.id).select('-password');
            const newPost=new postModel({
                text:req.body.text,
            name:user.name,
            user:req.user.id});

            const post= await newPost.save();
            res.json(post);

    } catch (error) {
        
        console.error(error)
        res.status(500).send('Servewr error')

}

})
//@route GET api/getpost
//@desc get posts
//@access Private
router.get('/getpost',auth,async(req,res)=>{
    try {
        const  posts=await postModel.find().sort({date:-1});
        res.json(posts)
    } catch (error) {
           
        console.error(error)
        res.status(500).send('Servewr error')
    }

})
//@route DETELE api/deletepost
//@desc delete posts
//@access Private
router.delete('/deletepost/:id',auth,async(req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({ msg: 'Post not found' });
        }
        // Check user
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }
    
        await post.remove();
    
        res.json({ msg: 'Post removed' });
      } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId')
        {
            return res.status(404).json({ msg: 'objectid not found' });
        }
    
        res.status(500).send('Server Error');
      }
    });

 //@route GET api/getpostbyid/:id
//@desc get posts by id
//@access Private
router.get('/getpostbyid/:id',auth,async(req,res)=>{
    console.log("DDDD");
    try {
        const  posts=await postModel.findById(req.params.id);
        if (!posts) {
            return res.status(404).json({ msg: 'Post not found' });
          }

        res.json(posts)
    } catch (error) {
        console.error(error)
        if(error.kind==="ObjectId")
        {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Servewr error')
    }

})


//@route PUT api/postlike/:id
//@desc like a post
//@access Private

router.put('/postlike/:id',auth,async(req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.some((like) => like.user.toString() === req.user.id)) {
          return res.status(400).json({ msg: 'Post already liked' });
        }
    
        post.likes.unshift({ user: req.user.id });
    
        await post.save();
    
        return res.json(post.likes);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });


 //@route PUT api/postunlike/:id
//@desc unlike a post
//@access Private

    router.put('/postunlike/:id',auth, async (req, res) => {
      try {
        const post = await postModel.findById(req.params.id);
    
        // Check if the post has not yet been liked
        if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
          return res.status(400).json({ msg: 'Post has not yet been liked' });
        }
    
        // remove the like
        post.likes = post.likes.filter(
          ({ user }) => user.toString() !== req.user.id
        );
    
        await post.save();
    
        return res.json(post.likes);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });


//@route POST api/addpostcomment
//@desc add posts comment
//@access Private
    router.post('/addpostcomment/:id',auth,async(req,res)=>{
  
    
      const { error } = validatePostCommentDetail(req.body);

      if (error) {
        return res.status(400).json(error.details[0].message);
      }
      try {
              const user =await userModel.findById(req.user.id).select('-password');
              const posts =await postModel.findById(req.params.id)
              const newComment={
              text:req.body.text,
              name:user.name,
              user:req.user.id};

              posts.comments.unshift(newComment);
  
               await posts.save();
              res.json(posts.comments);
  
      } catch (error) {
          
          console.error(error)
          res.status(500).send('Servewr error')
  
  }
  
  })

//@route delete api/deletepostcomment
//@desc delete posts comment
//@access Private
  router.delete('/deletepostcomment/:id/:cmnt_id', auth, async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
    
      const comment = post.comments.find(
        (comment)=> comment._id == req.params.cmnt_id);
      
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
   
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.cmnt_id
      );
      await post.save();
  
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });


module.exports=router