'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoria = mongoose.model('Categoria'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categoria;

/**
 * Categoria routes tests
 */
describe('Categoria CRUD tests', function () {

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

    // Save a user to the test db and create new Categoria
    user.save(function () {
      categoria = {
        name: 'Categoria name'
      };

      done();
    });
  });

  it('should be able to save a Categoria if logged in', function (done) {
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

        // Save a new Categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle Categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Get a list of Categorias
            agent.get('/api/categorias')
              .end(function (categoriasGetErr, categoriasGetRes) {
                // Handle Categorias save error
                if (categoriasGetErr) {
                  return done(categoriasGetErr);
                }

                // Get Categorias list
                var categorias = categoriasGetRes.body;

                // Set assertions
                (categorias[0].user._id).should.equal(userId);
                (categorias[0].name).should.match('Categoria name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Categoria if not logged in', function (done) {
    agent.post('/api/categorias')
      .send(categoria)
      .expect(403)
      .end(function (categoriaSaveErr, categoriaSaveRes) {
        // Call the assertion callback
        done(categoriaSaveErr);
      });
  });

  it('should not be able to save an Categoria if no name is provided', function (done) {
    // Invalidate name field
    categoria.name = '';

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

        // Save a new Categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(400)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Set message assertion
            (categoriaSaveRes.body.message).should.match('Please fill Categoria name');

            // Handle Categoria save error
            done(categoriaSaveErr);
          });
      });
  });

  it('should be able to update an Categoria if signed in', function (done) {
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

        // Save a new Categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle Categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Update Categoria name
            categoria.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categoria
            agent.put('/api/categorias/' + categoriaSaveRes.body._id)
              .send(categoria)
              .expect(200)
              .end(function (categoriaUpdateErr, categoriaUpdateRes) {
                // Handle Categoria update error
                if (categoriaUpdateErr) {
                  return done(categoriaUpdateErr);
                }

                // Set assertions
                (categoriaUpdateRes.body._id).should.equal(categoriaSaveRes.body._id);
                (categoriaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Categorias if not signed in', function (done) {
    // Create new Categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
      // Request Categorias
      request(app).get('/api/categorias')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Categoria if not signed in', function (done) {
    // Create new Categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the Categoria
    categoriaObj.save(function () {
      request(app).get('/api/categorias/' + categoriaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', categoria.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Categoria with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categorias/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categoria is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Categoria which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categoria
    request(app).get('/api/categorias/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Categoria with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Categoria if signed in', function (done) {
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

        // Save a new Categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle Categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Delete an existing Categoria
            agent.delete('/api/categorias/' + categoriaSaveRes.body._id)
              .send(categoria)
              .expect(200)
              .end(function (categoriaDeleteErr, categoriaDeleteRes) {
                // Handle categoria error error
                if (categoriaDeleteErr) {
                  return done(categoriaDeleteErr);
                }

                // Set assertions
                (categoriaDeleteRes.body._id).should.equal(categoriaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Categoria if not signed in', function (done) {
    // Set Categoria user
    categoria.user = user;

    // Create new Categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the Categoria
    categoriaObj.save(function () {
      // Try deleting Categoria
      request(app).delete('/api/categorias/' + categoriaObj._id)
        .expect(403)
        .end(function (categoriaDeleteErr, categoriaDeleteRes) {
          // Set message assertion
          (categoriaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categoria error error
          done(categoriaDeleteErr);
        });

    });
  });

  it('should be able to get a single Categoria that has an orphaned user reference', function (done) {
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

          // Save a new Categoria
          agent.post('/api/categorias')
            .send(categoria)
            .expect(200)
            .end(function (categoriaSaveErr, categoriaSaveRes) {
              // Handle Categoria save error
              if (categoriaSaveErr) {
                return done(categoriaSaveErr);
              }

              // Set assertions on new Categoria
              (categoriaSaveRes.body.name).should.equal(categoria.name);
              should.exist(categoriaSaveRes.body.user);
              should.equal(categoriaSaveRes.body.user._id, orphanId);

              // force the Categoria to have an orphaned user reference
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

                    // Get the Categoria
                    agent.get('/api/categorias/' + categoriaSaveRes.body._id)
                      .expect(200)
                      .end(function (categoriaInfoErr, categoriaInfoRes) {
                        // Handle Categoria error
                        if (categoriaInfoErr) {
                          return done(categoriaInfoErr);
                        }

                        // Set assertions
                        (categoriaInfoRes.body._id).should.equal(categoriaSaveRes.body._id);
                        (categoriaInfoRes.body.name).should.equal(categoria.name);
                        should.equal(categoriaInfoRes.body.user, undefined);

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
      Categoria.remove().exec(done);
    });
  });
});
