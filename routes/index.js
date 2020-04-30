const express = require('express');
const router = express.Router();

const bcryptjs= require('bcryptjs');
const saltRounds = 10;  //saltRounds şifreleme aralığı

//token oluşturabilmek için
const jwt = require('jsonwebtoken');


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


router.post('/authenticate',(req,res)=> {
  const { username,password } = req.body;

  User.findOne({
    username
  }, (err,user)=>{
    if(err)
      throw err;

    if(!user)
    {
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }
    else
    {
      //Eger user varsa kullanıcı tarafından girilen şifre ile veritabındaki şifreyi karşılaitıracağız.
      //ilk parametree request ile gelen,ikincisi veritabnındaki
      bcryptjs.compare(password,user.password).then((result)=>{
        if(!result) {//result true ya da false geliyor.
          res.json({
            status: false,
            message: 'Authentication failed, wrong password.'
          });
        }
        else
        {
          //payload oluşturyoruz. Payload'da neyi taımak istiyorasak onları yazıyoruz.
            const payload = {
              username
            };
            const token = jwt.sign(payload,req.app.get('api_secret_key'),{
              expiresIn: 720 // 12 saat
            });

            res.json({
              status: true,
              token
            });
        }
      });
    }
  });

});


module.exports = router;
