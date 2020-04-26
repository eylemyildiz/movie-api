const mongoose = require('mongoose');

module.exports = ()=>{
    //mongodb bağlantısını yapıyoruz.
    mongoose.connect('mongodb://movie_user:abcd1234@ds161245.mlab.com:61245/heroku_0s1v31n6',{ useNewUrlParser: true });
    mongoose.connection.on('open' , ()=>{
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error' , (err)=>{
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};