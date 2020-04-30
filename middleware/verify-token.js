const jwt = require('jsonwebtoken');

//middleware'i aşağıda yazıyoruz.
module.exports = (req,res,next) =>{
  //token; headers ile, post ile yani body ile ve get query'sinde gelebilir. Aşağıda bu üç durum yazıldı
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    //kullanıcıdan gelen query örneği : localhost:3000/api/movies?token=0efmekfnw
    //token var mı yok mu kontrol ediyoruz.
    if(token)
    {
        //Öncelikle verify etmemiz lazım.
        jwt.verify(token,req.app.get('api_secret_key'), (err,decoded)=>{
            if(err){
                res.json({
                    status: false,
                    message: 'Failed to authenticate token.'
                });
            }
            else
            {
                req.decode = decoded; //eğer token verify olduysa request'e bunu ekliyorum.
                console.log(decoded); //payload gelecek yani:bu console'a basıldığında birinci username,ikincisi iat yani token'ın oluşturma tarihi ifade eder,üçüncüsü de token'ın biteceği süreyi gösteriyor yani token'ın süresini gösteriyor.
                next(); //herşey yolunda herhangi bir route ile eşleşebilirisn anlamına geliyor.
            }
        });
    }
    else
    {
        res.json({
            status: false,
            message: 'No token provided.'
        });
    }

};