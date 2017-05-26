const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const User = require('../models/userschema');
const {TEST_DATABASE_URL} = require('../config');
const {runServer, app, closeServer} = require('../app');

chai.use(chaiHttp);

function seedUserData() {
  console.info('seeding client info');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateUserInfo());
  }
  return User.insertMany(seedData);
}

function generateUserInfo() {
  return {
    name: faker.name.firstName(),
    username: faker.name.lastName(),
    email: faker.name.firstName(),
    password: faker.name.lastName()
  }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('User Info API resource', function() {

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

    it('should return all existing clients', function() {
      let res;
      return chai.request(app)
        .get('/login')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Client.count();
        })
        .then(function(count) {
          res.body.should.have.length.of(count);
        });
    });


    it('should return clients with right fields', function() {

      let resClient;
      return chai.request(app)
        .get('/api/clients')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(client) {
            client.should.be.a('object');
            client.should.include.keys(
              '_id', 'name', 'email', 'password');
          });
          resClient = res.body[0];
          return Client.findById(resClient._id);
        })
        .then(function(client) {
          resClient._id.should.equal((client._id).toString());
          resClient.name.should.equal(client.name);
          resClient.email.should.equal(client.email);
          resClient.password.should.equal(client.password);
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new client', function() {

      const newClient = generateClientInfo();

      return chai.request(app)
        .post('/api/clients')
        .send(newClient)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            '_id', 'name', 'email', 'password');
          res.body._id.should.not.be.null;
          res.body.name.should.equal(newClient.name);
          res.body.email.should.equal(newClient.email);
          res.body.password.should.equal(newClient.password);
          return Client.findById(res.body._id);
        })
        .then(function(client) {
          client.name.should.equal(newClient.name);
          client.email.should.equal(newClient.email);
          client.password.should.equal(newClient.password);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        name: 'update name',
        email: 'update email',
        password: 'update password'
      };

      return Client
        .findOne()
        .exec()
        .then(function(client) {
          updateData.id = client.id;
          return chai.request(app)
            .put(`/api/clients/${client.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(200);
          return Client.findById(updateData.id).exec();
        })
        .then(function(client) {
          client.name.should.equal(updateData.name);
          client.email.should.equal(updateData.email);
          client.password.should.equal(updateData.password);
        });
      });
  });

  describe('DELETE endpoint', function() {
    it('delete a client by id', function() {

      let client;

      return Client
        .findOne()
        .exec()
        .then(function(_client) {
          client = _client;
          return chai.request(app).delete(`/api/clients/${client.id}`);
        })
        .then(function(res) {
          res.should.have.status(200);
          return Client.findById(client.id).exec();
        })
        .then(function(_client) {
          should.not.exist(_client);
        });
    });
  });
});
