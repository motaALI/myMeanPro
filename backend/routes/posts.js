const express = require("express");

const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
// create a file storage

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
     if (isValid) {
       error = null;
     }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  console.log(post);
  // save data to  database
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      // postId: createdPost._id  i want return entire post not juste post id
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
        // OR YOU CAN DO IT LIKE THIS
        // ...createdPost,
        // id: createdPost._id
      }

    });
  });
});

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});


router.get('',(req, res, next) => { // CAN BE like => app.use('/api/posts',(req, res, next)
   Post.find()
   .then(documents => {
       // console.log(documents);
      // res.json(posts); OR with a message
     res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
   });
});

router.delete('/:id', (req, res, next) => {
  console.log('your deleted post id :', req.params.id);
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'});
  });

});

module.exports = router;
