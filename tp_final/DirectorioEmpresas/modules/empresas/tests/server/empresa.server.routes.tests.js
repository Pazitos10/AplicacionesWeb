'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Empresa = mongoose.model('Empresa'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  empresa;

/**
 * Empresa routes tests
 */
describe('Empresa CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Empresa
    user.save(function () {
      empresa = {
        name: 'Empresa name'
      };

      done();
    });
  });

  it('should be able to save a Empresa if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Empresa
        agent.post('/api/empresas')
          .send(empresa)
          .expect(200)
          .end(function (empresaSaveErr, empresaSaveRes) {
            // Handle Empresa save error
            if (empresaSaveErr) {
              return done(empresaSaveErr);
            }

            // Get a list of Empresas
            agent.get('/api/empresas')
              .end(function (empresasGetErr, empresasGetRes) {
                // Handle Empresas save error
                if (empresasGetErr) {
                  return done(empresasGetErr);
                }

                // Get Empresas list
                var empresas = empresasGetRes.body;

                // Set assertions
                (empresas[0].user._id).should.equal(userId);
                (empresas[0].name).should.match('Empresa name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Empresa if not logged in', function (done) {
    agent.post('/api/empresas')
      .send(empresa)
      .expect(403)
      .end(function (empresaSaveErr, empresaSaveRes) {
        // Call the assertion callback
        done(empresaSaveErr);
      });
  });

  it('should not be able to save an Empresa if no name is provided', function (done) {
    // Invalidate name field
    empresa.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Empresa
        agent.post('/api/empresas')
          .send(empresa)
          .expect(400)
          .end(function (empresaSaveErr, empresaSaveRes) {
            // Set message assertion
            (empresaSaveRes.body.message).should.match('Please fill Empresa name');

            // Handle Empresa save error
            done(empresaSaveErr);
          });
      });
  });

  it('should be able to update an Empresa if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Empresa
        agent.post('/api/empresas')
          .send(empresa)
          .expect(200)
          .end(function (empresaSaveErr, empresaSaveRes) {
            // Handle Empresa save error
            if (empresaSaveErr) {
              return done(empresaSaveErr);
            }

            // Update Empresa name
            empresa.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Empresa
            agent.put('/api/empresas/' + empresaSaveRes.body._id)
              .send(empresa)
              .expect(200)
              .end(function (empresaUpdateErr, empresaUpdateRes) {
                // Handle Empresa update error
                if (empresaUpdateErr) {
                  return done(empresaUpdateErr);
                }

                // Set assertions
                (empresaUpdateRes.body._id).should.equal(empresaSaveRes.body._id);
                (empresaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Empresas if not signed in', function (done) {
    // Create new Empresa model instance
    var empresaObj = new Empresa(empresa);

    // Save the empresa
    empresaObj.save(function () {
      // Request Empresas
      request(app).get('/api/empresas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Empresa if not signed in', function (done) {
    // Create new Empresa model instance
    var empresaObj = new Empresa(empresa);

    // Save the Empresa
    empresaObj.save(function () {
      request(app).get('/api/empresas/' + empresaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', empresa.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Empresa with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/empresas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Empresa is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Empresa which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Empresa
    request(app).get('/api/empresas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Empresa with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Empresa if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Empresa
        agent.post('/api/empresas')
          .send(empresa)
          .expect(200)
          .end(function (empresaSaveErr, empresaSaveRes) {
            // Handle Empresa save error
            if (empresaSaveErr) {
              return done(empresaSaveErr);
            }

            // Delete an existing Empresa
            agent.delete('/api/empresas/' + empresaSaveRes.body._id)
              .send(empresa)
              .expect(200)
              .end(function (empresaDeleteErr, empresaDeleteRes) {
                // Handle empresa error error
                if (empresaDeleteErr) {
                  return done(empresaDeleteErr);
                }

                // Set assertions
                (empresaDeleteRes.body._id).should.equal(empresaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Empresa if not signed in', function (done) {
    // Set Empresa user
    empresa.user = user;

    // Create new Empresa model instance
    var empresaObj = new Empresa(empresa);

    // Save the Empresa
    empresaObj.save(function () {
      // Try deleting Empresa
      request(app).delete('/api/empresas/' + empresaObj._id)
        .expect(403)
        .end(function (empresaDeleteErr, empresaDeleteRes) {
          // Set message assertion
          (empresaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Empresa error error
          done(empresaDeleteErr);
        });

    });
  });

  it('should be able to get a single Empresa that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Empresa
          agent.post('/api/empresas')
            .send(empresa)
            .expect(200)
            .end(function (empresaSaveErr, empresaSaveRes) {
              // Handle Empresa save error
              if (empresaSaveErr) {
                return done(empresaSaveErr);
              }

              // Set assertions on new Empresa
              (empresaSaveRes.body.name).should.equal(empresa.name);
              should.exist(empresaSaveRes.body.user);
              should.equal(empresaSaveRes.body.user._id, orphanId);

              // force the Empresa to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Empresa
                    agent.get('/api/empresas/' + empresaSaveRes.body._id)
                      .expect(200)
                      .end(function (empresaInfoErr, empresaInfoRes) {
                        // Handle Empresa error
                        if (empresaInfoErr) {
                          return done(empresaInfoErr);
                        }

                        // Set assertions
                        (empresaInfoRes.body._id).should.equal(empresaSaveRes.body._id);
                        (empresaInfoRes.body.name).should.equal(empresa.name);
                        should.equal(empresaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Empresa.remove().exec(done);
    });
  });
});
