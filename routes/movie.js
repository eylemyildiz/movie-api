const express = require('express');
const router = express.Router();

//Models
const Movie = require('../models/Movie');

//Tüm movie'leri listelemek için
router.get('/',(req,res)=>{
 const promise = Movie.aggregate([
     {
        $lookup: {
            from:'directors',
            localField: 'director_id',
            foreignField: '_id',
            as: 'director'
        }
     },
     {
         $unwind: '$director'
     }
     ]);

 promise.then((data)=>{
  res.json(data);
 }).catch((err) =>{
   res.json(err);
 });
});

//Top 10 list
router.get('/top10',(req,res)=>{
  const promise = Movie.find({ }).limit(10).sort({imdb_score: -1});

  promise.then((data)=>{
    res.json(data);
  }).catch((err) =>{
    res.json(err);
  });
});

//id'ye göre movie
router.get('/:movie_id', (req,res,next)=>{
  //res.send(req.params);
  const promise= Movie.findById(req.params.movie_id);

  promise.then((movie) =>{
    if(!movie)
      next({message: 'The movie was not found!',code: 99});

    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});

//Movie güncelleme endpoint'i için
router.put('/:movie_id', (req,res,next)=>{
  //res.send(req.params);
  const promise= Movie.findByIdAndUpdate(
      req.params.movie_id,
      req.body,
      //Güncelleme işlemi sonrasında güncellenen datanın dönmesi için; yoksa hep çıktı olarak bir öncekini basıyor güncelleme yaptığı halde
      {
        new: true
      }
      );

  promise.then((movie) =>{
    if(!movie)
      next({message: 'The movie was not found!',code: 99});

    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });
});

//Veritabanından movie silme
router.delete('/:movie_id', (req,res,next)=>{
  //res.send(req.params);
  const promise= Movie.findByIdAndRemove(req.params.movie_id);

  promise.then((movie) =>{
    if(!movie)
      next({message: 'The movie was not found!',code: 99});

    //res.json(movie);
      res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  });
});

//Veritabanına movie ekleme
router.post('/', function(req, res, next) {
  /*const { title, imdb_score, category, country, year } =req.body;
  //diyelim çok fazla data göndericez.Bu durumda yukarıdaki destructure'ı kapatıp aşağıdaki satırı da şu hale getirebiliriz.
  //const movie= new Movie(req.body);
  const movie= new Movie({
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });*/
  const movie= new Movie(req.body);
  //Daha temiz hali aşağıda promise'li yapı
 /* movie.save((err,data) =>{
    if(err)
      res.json(err);

    res.json(data);
  });*/

const promise = movie.save();
promise.then((data) =>{
  //res.json({status: 1});
    res.json(data);
}).catch((err)=>{
  res.json(err);
});
});


//Between
router.get('/between/:start_year/:end_year',(req,res)=>{
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
      {
        year: {"$gte": parseInt(start_year), "$lte": parseInt(end_year) }//gte operatörü büyük veya eşit anlamına geliyor.lte küçük veya eşit.
      }
      );

  promise.then((data)=>{
    res.json(data);
  }).catch((err) =>{
    res.json(err);
  });
});



module.exports = router;
