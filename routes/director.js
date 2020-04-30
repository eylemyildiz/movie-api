const mongoose= require('mongoose');
const express = require('express');
const router = express.Router();

//Models
const Director = require('../models/Director');

router.post('/',(req,res,next)=>{
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//Direktörleri listelerken beraberinde filmlerini de listeler.
router.get('/',(req,res,)=>{
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies' //dönen datanın atanacağı değişken
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true  //bu filmi olmayan direktörlerinde outputa gelmesini sağlar.postman'deki output
      }
    },
    {
      //output görüntüsünü ayarlamak için ypıldı.kaldırıp değişikliği görebilirsin.
      //Bu bir direktörle ilgili birden fazla bilginin gruplanmasını sağlar.
      //movie'leri derli toplu aynı array içinde yer alır.
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      //output görüntüsünü ayarlamak için ypıldı.kaldırıp değişikliği görebilirsin.
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) =>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//id ile director get'i
router.get('/:director_id',(req,res,)=>{
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)  //director id bir object id oldugu için böyle gönderdik.
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies' //dönen datanın atanacağı değişken
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true  //bu filmi olmayan direktörlerinde outputa gelmesini sağlar.postman'deki output
      }
    },
    {
      //output görüntüsünü ayarlamak için ypıldı.kaldırıp değişikliği görebilirsin.
      //Bu bir direktörle ilgili birden fazla bilginin gruplanmasını sağlar.
      //movie'leri derli toplu aynı array içinde yer alır.
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      //output görüntüsünü ayarlamak için ypıldı.kaldırıp değişikliği görebilirsin.
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) =>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


//Director güncelleme endpoint'i için
router.put('/:director_id', (req,res,next)=>{
  //res.send(req.params);
  const promise= Director.findByIdAndUpdate(
      req.params.director_id,
      req.body,
      //Güncelleme işlemi sonrasında güncellenen datanın dönmesi için; yoksa hep çıktı olarak bir öncekini basıyor güncelleme yaptığı halde
      {
        new: true
      }
  );

  promise.then((director) =>{
    if(!director)
      next({message: 'The director was not found!',code: 99});

    res.json(director);
  }).catch((err)=>{
    res.json(err);
  });
});

//Veritabanından director silme
router.delete('/:director_id', (req,res,next)=>{
  //res.send(req.params);
  const promise= Director.findByIdAndRemove(req.params.director_id);

  promise.then((director) =>{
    if(!director)
      next({message: 'The director was not found!',code: 99});

    res.json(director);
  }).catch((err)=>{
    res.json(err);
  });
});


module.exports = router;
