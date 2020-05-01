const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();//sonuc şu olmalı ifadelerini kullanmak için
//server'ı dahil ediyoruz.
const server = require('../../app');

chai.use(chaiHttp); //http plug-in için

describe('Node Server', () =>{
    it('(GET /) anasayfayı döndürür' , (done) =>{
       chai.request(server)
           .get('/')    //direk kök dizin
           .end((err,res)=>{
               res.should.have.status(200);
               done();
           })
        // done(); //test bitti sıkıntı yok.herşey yolunda demek
    });
});