const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const mocha = require('mocha');
const assert = require('assert');

const should = chai.should();

const User = require('../models/userschema');
const {TEST_DATABASE_URL} = require('../config');
const {runServer, app, closeServer} = require('../app');

chai.use(chaiHttp);

let manager;

function generateUserInfo() {
  return {
    name: faker.name.firstName(),
    username: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.random.word()
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

  describe('GET endpoint', function() {

    it.skip('should login as manager', function () {
      return chai.request.agent(app)
      .post('/users/login')
      .type('form')
      .send({
        username: manager.username, 
        password: manager.password})
      .then(function(res) {
        console.log(manager);
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      })
    });

    it.skip('should not login as manager', function () {
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

    it.skip('should return all existing users', function() {
      return chai.request(app)
        .get('/manager/userlist')
        .then(function(res) {
          console.log(res.body[0]);
          res.body.should.have.status(200);
          res.body[0].should.have.length.of.at.least(1);
          return User.count();
        })
        .then(function(count) {
          res.body.should.have.length.of(count);
        });
    });


    it.skip('should return users with right fields', function() {

      let resUser;
      return chai.request(app)
        .get('/manager/userlist')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.jsonp;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(user) {
            user.should.be.a('object');
            user.should.include.keys(
              '_id', 'name', 'email', 'password');
          });
          resUser = res.body[0];
          return User.findById(resUser._id);
        })
        .then(function(user) {
          resUser._id.should.equal((user._id).toString());
          resUser.name.should.equal(user.name);
          resUser.email.should.equal(user.email);
          resUser.password.should.equal(user.password);
        });
    });
  });

  describe('POST endpoint', function() {
    it.skip('should add a new user', function() {

      const newUser = generateUserInfo();

      return chai.request(app)
        .post('/manager/userlist')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            '_id', 'name', 'email', 'password');
          res.body._id.should.not.be.null;
          res.body.name.should.equal(newUser.name);
          res.body.email.should.equal(newUser.email);
          res.body.password.should.equal(newUser.password);
          return User.findById(res.body._id);
        })
        .then(function(user) {
          user.name.should.equal(newUser.name);
          user.email.should.equal(newUser.email);
          user.password.should.equal(newUser.password);
        });
    });
  });

  describe('PUT endpoint', function() {

    it.skip('should update fields you send over', function() {
      const updateData = {
        name: 'update name',
        email: 'update email',
        password: 'update password'
      };

      return User
        .findOne()
        .exec()
        .then(function(user) {
          updateData.id = user.id;
          return chai.request(app)
            .put(`/manager/userlist/${user.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(200);
          return User.findById(updateData.id).exec();
        })
        .then(function(user) {
          user.name.should.equal(updateData.name);
          user.email.should.equal(updateData.email);
          user.password.should.equal(updateData.password);
        });
      });
  });

  describe('DELETE endpoint', function() {
    it('delete a user by id', function() {

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
