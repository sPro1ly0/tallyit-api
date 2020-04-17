process.env.TZ = 'UCT';
require('dotenv').config();

const { expect } = require('chai');
const supertest = require('supertest');

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
  'postgresql://macarina@localhost/tallyit-test';

global.expect = expect;
global.supertest = supertest;