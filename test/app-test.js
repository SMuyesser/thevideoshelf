const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const mocha = require('mocha');
const assert = require('assert');
const cheerio = require('cheerio');
const chaiCheerio = require('chai-cheerio');
const passport = require('passport');

const should = chai.should();

const User = require('../models/userschema');
const {TEST_DATABASE_URL} = require('../config');
const {runServer, app, closeServer} = require('../app');

chai.use(chaiHttp);
chai.use(chaiCheerio);

let manager;
let user;

function generateUserInfo() {
  return {
    name: faker.name.firstName(),
    username: faker.name.lastName(),
    email: faker.internet.email(),
    password: "password123",
    password2: "password123"
  }
}

function generateClientInfo() {
  return {
    name: "Mock Client",
    logo: "https://static.wixstatic.com/media/57c7c5_d544d255efc84c2092314374790b5bd6~mv2.jpeg/v1/fill/w_194,h_145,al_c,lg_1,q_80/57c7c5_d544d255efc84c2092314374790b5bd6~mv2.webp",
    videos: [
      "https://vimeo.com/221496191",
      "https://vimeo.com/181664828",
      "https://vimeo.com/181095436"
    ]
  }
}

function seedUserData() {
  console.info('seeding test user info');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateUserInfo());
  }
  seedData[0].manager=true;
  manager = seedData[0];
  user = seedData[1];
  return Promise.all(seedData.map(function(userData){
    return User.create(userData);
  }));
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('thevideoshelfdb tests', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

  describe('Logging in and out', function() {

    it.skip('should not login as manager', function() {
      return chai.request(app)
      .post('/users/login')
      .type('form')
      .send({
        username: manager.username, 
        password: manager.password+"banana"})
      .then(function(res) {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/users/login`);
      })
    });

    it.skip('should login as manager', function() {
      return chai.request.agent(app)
      .post('/users/login')
      .type('form')
      .send({
        username: manager.username, 
        password: manager.password})
      .then(function(res) {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      })
    });

    it.skip('should logout', function() {
      const agent = chai.request.agent(app);
      return agent.post('/users/login')
      .type('form')
      .send({
        username: manager.username, 
        password: manager.password})
      .then((res) => {
        return agent.get('/users/logout')
        .then((res) => {
          res.statusCode.should.equal(200);
          res.type.should.equal('text/html');
          res.should.redirect;
          res.should.redirectTo(`${res.request.protocol}//${res.request.host}/users/login`);
          const $ = cheerio.load(res.text);
          $('div.alert-success').should.exist;
        });
      });
    });

  });

  describe('Register new user', function(){

    it.skip('should render user register form', function() {
      return chai.request(app)
      .get('/users/register')
      .then((res) => {
        res.statusCode.should.equal(200);
        res.type.should.equal('text/html');
        const $ = cheerio.load(res.text);
        $('form#js-register-form').should.exist;
      })
    });

    it.skip('should add a new user', function() {

      const newUser = generateUserInfo();

      return chai.request(app)
        .post('/users/register')
        .type('form')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(200);
          res.should.redirectTo(`${res.request.protocol}//${res.request.host}/users/login`);
        })
    });
    
  });

  describe('GET manager/userlist', function() {

    it.skip('should return all existing users as manager', function() {
      const agent = chai.request.agent(app);
      return agent.post('/users/login')
      .type('form')
      .send({
        username: manager.username, 
        password: manager.password})
      .then((res) => {
        return agent.get('/manager/userlist')
        .then((res) => {
          res.statusCode.should.equal(200);
          res.type.should.equal('text/html');
          const $ = cheerio.load(res.text);
          $('div.user').should.exist;
          $('div.user').length.should.equal(10);
        });
      });
    });

    it.skip('should not return all existing users if not manager', function() {
      const agent = chai.request.agent(app);
      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.get('/manager/userlist')
        .then((res) => {
          res.statusCode.should.equal(200);
          res.type.should.equal('text/html');
          const $ = cheerio.load(res.text);
          $('div.user').should.not.exist;
        });
      });
    });

  });

  describe('Client tests', function() {

    it.skip('should render client register form', function() {
      const agent = chai.request.agent(app);
      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.get('/users/registerclient')
        .then((res) => {
          res.statusCode.should.equal(200);
          res.type.should.equal('text/html');
          const $ = cheerio.load(res.text);
          $('form').should.exist;
        });
      });
    });

    it.skip('should create new client', function() {
      const agent = chai.request.agent(app);
      const newClient = generateClientInfo();

      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.post('/users/registerclient')
        .type('form')
        .send(newClient)
        .then((res) => {
          res.statusCode.should.equal(200);
          res.type.should.equal('text/html');
          res.should.redirect;
          res.should.redirectTo(`${res.request.protocol}//${res.request.host}/users/clientlist`)
        });
      });
    });
    

    it.skip('should render user/clientlist with clients', function() {
      const agent = chai.request.agent(app);
      const newClient = generateClientInfo();

      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.post('/users/registerclient')
        .type('form')
        .send(newClient)
        .then((res) => {
          return agent.get('/users/clientlist')
          .then((res) => {
            res.statusCode.should.equal(200);
            res.type.should.equal('text/html');
            const $ = cheerio.load(res.text);
            $('div.client').should.exist;
          });
        });
      });
    });

    it.skip('should render clientpage', function(){
      const agent = chai.request.agent(app);
      const newClient = generateClientInfo();

      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.post('/users/registerclient')
        .type('form')
        .send(newClient)
        .then((res) => {
            return agent.get('/users/clientlist/594c27c7cca40b2f18a983b0')
            .then((res) => {
              res.statusCode.should.equal(200);
              res.type.should.equal('text/html');
              const $ = cheerio.load(res.text);
              $('div.client-page-header').should.exist;
            });
        });
      });
    });

    it.skip('should render edit clientpage', function(){
      const agent = chai.request.agent(app);
      const newClient = generateClientInfo();

      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.post('/users/registerclient')
        .type('form')
        .send(newClient)
        .then((res) => {
            return agent.get('/users/editclient/594c27c7cca40b2f18a983b0')
            .then((res) => {
              res.statusCode.should.equal(200);
              res.type.should.equal('text/html');
              const $ = cheerio.load(res.text);
              $('form#js-client-update-form').should.exist;
            });
        });
      });
    });

    it('should update client', function(){
      const agent = chai.request.agent(app);
      const newClient = generateClientInfo();
      const updatedClient = {
        name: "Updated Mock Client"
      }

      return agent.post('/users/login')
      .type('form')
      .send({
        username: user.username, 
        password: user.password})
      .then((res) => {
        return agent.post('/users/registerclient')
        .type('form')
        .send(newClient)
        .then((res) => {
            return agent.get('/users/editclient/594c27c7cca40b2f18a983b0')
            .then((res) => {
                console.log(res.text);
                return agent.put('/clientlist/594c27c7cca40b2f18a983b0')
                .send(updatedClient)
                .then((res) => {
                  console.log(res.text);
                })
            });
        });
      });
    });



  });

  describe('DELETE endpoint', function() {
/*router.delete('/clientlist/:_id', ensureAuthenticated, function(req, res) {
*/    it.skip('delete a user by id', function() {

      let user;

      return User
        .findOne()
        .exec()
        .then(function(_user) {
          user = _user;
          return chai.request(app).delete(`/manager/userlist/${user.id}`);
        })
        .then(function(res) {
          res.should.have.status(200);
          return User.findById(user.id).exec();
        })
        .then(function(_user) {
          should.not.exist(_user);
        });
    });
  });
});







