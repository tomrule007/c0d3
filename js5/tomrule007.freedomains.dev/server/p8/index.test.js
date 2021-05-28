const app = require('../app');
const request = require('supertest');
const fs = require('fs').promises;

const { USER_SELFIE_PATH } = require('./index');
describe('js5/p8', () => {
  describe('POST /p8/api/selfie', () => {
    let mockSelfie;
    let link;
    beforeAll(async () => {
      link = null;
      mockSelfie = await fs.readFile('./public/p8/test-selfie.png', {
        encoding: 'base64',
      });
    });
    it('returns error if selfie field is missing', async () => {
      const response = await request(app)
        .post('/p8/api/selfie')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.error).not.toBeUndefined();
    });
    it('with base64 image returns link to', async () => {
      const res = await request(app)
        .post('/p8/api/selfie')
        .send({ selfie: mockSelfie })
        .expect('Content-Type', /json/)
        .expect(200);
      expect(res.body.link).toMatch(/.png$/);
      link = res.body.link;
    });
    it('link works, returns image and status 200', async () => {
      expect(link).toEqual(expect.any(String));
      const imageName = link.split('/').pop();
      await request(app)
        .get(`/p8/selfie/${imageName}`)
        .expect('Content-Type', /image\/png/)
        .expect(200);

      fs.unlink(USER_SELFIE_PATH + imageName);
    });
  });

  describe('GET /p8/api/selfie', () => {
    it('returns array if image links', async () => {
      // Public folder is exposed as url root
      const urlPrefix = USER_SELFIE_PATH.split('public').pop();

      const mockFiles = ['tom.png', 'is.png', 'cool.png'].map(
        (name) => urlPrefix + name
      );

      jest.spyOn(fs, 'readdir').mockResolvedValue(mockFiles);

      const response = await request(app)
        .get('/p8/api/selfie')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(fs.readdir).toHaveBeenCalledTimes(1);
      expect(fs.readdir).toHaveBeenCalledWith(USER_SELFIE_PATH);

      expect(response.body.links).toEqual(expect.arrayContaining(mockFiles));

      fs.readdir.mockRestore();
    });
  });
});
