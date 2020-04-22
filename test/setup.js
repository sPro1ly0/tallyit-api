process.env.TZ = 'UCT';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'mtest-jwt-secret';
process.env.JWT_EXPIRY = '3m';
require('dotenv').config();

const { expect } = require('chai');
const supertest = require('supertest');

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
  'postgresql://macarina@localhost/tallyit-test';

global.expect = expect;
global.supertest = supertest;