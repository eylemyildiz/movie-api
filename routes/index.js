const express = require('express');
const router = express.Router();

const bcryptjs= require('bcryptjs');
const saltRounds = 10;  //saltRounds şifreleme aralığı

//Models
const User = require('../models/User');
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next)=> {
  const {username, password} = req.body;

  bcryptjs.hash(password, saltRounds).then((hash) =>{   //hash şifrelenmiş data
    // Store hash in your password DB.

    const user = new User({
      username,
      password :hash
    });

    const promise = user.save();
    promise.then((data) =>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });


  });



});




module.exports = router;
