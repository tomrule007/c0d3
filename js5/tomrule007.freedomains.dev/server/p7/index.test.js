const request = require('supertest');
const app = require('../app');
const fs = require('fs').promises;
describe('js5/p7', () => {
  describe('POST /p7/files', () => {
    describe('user can upload multiple files', () => {
      it('return 202 on file upload', async () => {
        await request(app)
          .post('/p7/files')
          .attach('userFiles', './public/p7/test1.png')
          .expect('Content-Type', /json/)
          .expect(202);
      });
    });
  });
});
