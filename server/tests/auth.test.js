import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
import config from '../../config/config';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  const validUserCredentials = {
    login: 'TestingLogin',
    password: 'TestingPassword'
  };

  const invalidUserCredentials = {
    login: 'InvalidLogin',
    password: 'InvalidPassword'
  };

  describe('# POST /api/users (Creating a new user)', () => {
    it('should return True', (done) => {
      request(app)
      .post('/api/users')
      .send(validUserCredentials)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.login).to.equal(validUserCredentials.login);
        expect(res.body.password).to.equal(validUserCredentials.password);

        // Save user for next tests.
        global.user = {
          login: res.body.login,
          password: res.body.password,
          id: res.body._id
        };
        done();
      })
      .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should return Authentication error', (done) => {
      request(app)
      .post('/api/auth/login')
      .send(invalidUserCredentials)
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.message).to.equal('Authentication error');
        done();
      })
      .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
      .post('/api/auth/login')
      .send(validUserCredentials)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property('token');
        jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
          expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
          expect(decoded.username).to.equal(validUserCredentials.username);
          global.jwtToken = `Bearer ${res.body.token}`;
          done();
        });
      })
      .catch(done);
    });
  });

  describe('# GET /api/auth/random-number', () => {
    it('should fail to get random number because of missing Authorization', (done) => {
      request(app)
      .get('/api/auth/random-number')
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.message).to.equal('Unauthorized');
        done();
      })
      .catch(done);
    });

    it('should fail to get random number because of wrong token', (done) => {
      request(app)
      .get('/api/auth/random-number')
      .set('Authorization', 'Bearer inValidToken')
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.message).to.equal('Unauthorized');
        done();
      })
      .catch(done);
    });

    it('should get a random number', (done) => {
      request(app)
      .get('/api/auth/random-number')
      .set('Authorization', global.jwtToken)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.num).to.be.a('number');
        done();
      })
      .catch(done);
    });
  });
});
