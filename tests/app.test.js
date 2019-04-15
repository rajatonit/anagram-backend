const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../server/lambda-run')

describe('Unit testing the default routes', function() {
    it('/health should return OK status', function() {
      return request(app)
        .get('/health')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });
    it('/health should return message on rendering', function() {
      return request(app)
        .get('/health')
        .then(function(response){
            expect(response.text).to.contain('ok');
        })
    });

    it('/home should return OK status', function() {
        return request(app)
          .get('/api/v1/')
          .then(function(response){
              assert.equal(response.status, 200)
          })
      });

      it('/home should return message on rendering', function() {
        return request(app)
          .get('/api/v1/')
          .then(function(response){
              expect(response.text).to.contain('Welcome to the anagram API!');
          })
      });

});

describe('Unit testing the anagram', function() {
    it('/api/v1/anagram/@$ffdfd should return 400', function() {
      return request(app)
        .get('/api/v1/anagram/@$ffdfd"')
        .expect(400)
    });
    it('/api/v1/anagram/bats should return message and 200 on rendering', function() {
      return request(app)
        .get('/api/v1/anagram/bats')
        .expect(200)
        .then(function(response){
            expect(response.text).to.contain('{"word":"bats","anagrams":["bast","bats","stab"]}');
        })
    });
    it('/api/v1/anagram/sdaasds should return empty message and 200 on rendering', function() {
        return request(app)
          .get('/api/v1/anagram/sdaasds')
          .expect(200)
          .then(function(response){
              expect(response.text).to.contain('{"word":"sdaasds","anagrams":[]}');
          })
      });

});