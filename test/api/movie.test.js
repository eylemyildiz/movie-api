const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();//sonuc şu olmalı ifadelerini kullanmak için
//server'ı dahil ediyoruz.
const server = require('../../app');

chai.use(chaiHttp); //http plug-in için

let token,movieId; //token almak için kullanılacak
describe('/api/movies tests', () =>{

    //öncelikle token almamız lazım.Bunun için before kullanılacak
    //before: testler başlamadan önce çalışır.
    before((done) =>{
        chai.request(server)
            .post('/authenticate')
            .send({username: 'eylem.yildiz',password: 'hello1234'})
            .end((err,res)=>{
                token = res.body.token;
                console.log(token);
                done();
            });
    });

    describe('/GET movies', () =>{
        it('it should GET all the movies', (done) =>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)
                .end((err,res) => {
                    res.should.have.status(200);
                    //gelen response'un array oldugunu da test etmeliyim.
                    res.body.should.be.a('array');
                    done();
                });
        })
    });

    describe('/POST movie', () =>{
        it('it should post a movie', (done) =>{
            //Veritabanına gönderilecek data'lar
            const movie = {
                title: 'Udemy',
                director_id:'5ea5e1a7034e8637742a4262',
                category:'Komedi',
                country:'Turkiye',
                year:2000,
                imdb_score:8
            };
            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId= res.body._id;
                    done();
                });
        });
    });

    describe('/GET/:movie_id movie', () => {
        it('it should GET a movie by the given id', (done)=>{
           chai.request(server)
               .get('/api/movies/' + movieId)
               .set('x-access-token',token)
               .end((err,res)=>{
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('title');
                   res.body.should.have.property('director_id');
                   res.body.should.have.property('category');
                   res.body.should.have.property('country');
                   res.body.should.have.property('year');
                   res.body.should.have.property('imdb_score');
                   res.body.should.have.property('_id').eql(movieId);
                   done();
               });
        });
    });
});