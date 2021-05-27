const request = require('supertest');
const app = require('../app');
const { VALID_MOCK_USER } = require('./index');
describe('js5/p6', () => {
  describe('POST p6/api/users', () => {
    describe('password field cannot be blank and must be >5 letters', () => {
      it(' Missing requirements -> status 400', async () => {
        await request(app).post('/p6/api/users').send({}).expect(400);
        await request(app)
          .post('/p6/api/users')
          .send({ password: 'small' })
          .expect(400);
      });

      const badPassword = expect.objectContaining({
        error: { message: expect.stringContaining('password') },
      });

      const goodPassword = expect.not.objectContaining({
        error: { message: expect.stringContaining('password') },
      });

      it.each([
        [{}, badPassword],
        [{ password: 'short' }, badPassword],
        [{ password: 'goodOne' }, goodPassword],
        [{ password: 'greatOne' }, goodPassword],
      ])('%s -> %s', async (input, output) => {
        await request(app)
          .post('/p6/api/users')
          .send(input)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body).toEqual(output);
          });
      });
    });

    describe('username field cannot be blank, is alphanumeric and is unique', () => {
      it(' Missing requirements -> status 400', async () => {
        await request(app).post('/p6/api/users').send({}).expect(400);
        await request(app)
          .post('/p6/api/users')
          .send({ username: 'small' })
          .expect(400);
      });

      const badUsername = expect.objectContaining({
        error: { message: expect.stringContaining('username') },
      });

      const goodUsername = expect.not.objectContaining({
        error: { message: expect.stringContaining('username') },
      });

      it.each([
        [{}, badUsername, 'error w/ password'],
        [{ username: '-bad-' }, badUsername, 'error w/ password'],
        [{ username: 'goodOne' }, goodUsername, 'Not username error'],
        [{ username: 'greatOne' }, goodUsername, 'Not username error'],
      ])('Input: %s -> %s  ( %s )', async (input, output) => {
        await request(app)
          .post('/p6/api/users')
          .send({ password: 'skipthis', ...input })
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body).toEqual(output);
          });
      });

      it('Only allows unique usernames', async () => {
        const sameUsername = {
          password: 'skipthis',
          username: 'myusername',
          email: 'sample@sample',
        };

        await request(app)
          .post('/p6/api/users')
          .send(sameUsername)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body).toEqual(goodUsername);
          });

        await request(app)
          .post('/p6/api/users')
          .send(sameUsername)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body).toEqual({
              error: {
                message: 'username is already registered',
              },
            });
          });
      });

      describe('email field cannot be blank and is valid (alphanumeric and has @)', () => {
        it('email error on bad email', async () => {
          const badEmailResponse = expect.objectContaining({
            error: { message: expect.stringContaining('email') },
          });
          await request(app)
            .post('/p6/api/users')
            .send({ password: 'getpast', username: 'tommyboy', email: 'noat' })
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual(badEmailResponse);
            });
        });

        it('No email error on good email', async () => {
          const goodEmailResponse = expect.not.objectContaining({
            error: { message: expect.stringContaining('email') },
          });
          await request(app)
            .post('/p6/api/users')
            .send({
              password: 'getpast',
              username: 'tommyboy',
              email: 'im@good',
            })
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual(goodEmailResponse);
            });
        });
      });
    });
  });

  describe('POST p6/api/sessions', () => {
    it('Can login with username/password', async () => {
      const { username, email, password } = VALID_MOCK_USER;
      await request(app)
        .post('/p6/api/sessions')
        .send({ username, password })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({ username, email })
          );
        });
    });

    it('Can login with email/password', async () => {
      const { username, email, password } = VALID_MOCK_USER;
      await request(app)
        .post('/p6/api/sessions')
        .send({ email, password })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({ username, email })
          );
        });
    });

    it('Login does not return password or hash', async () => {
      const { username, email, password } = VALID_MOCK_USER;
      await request(app)
        .post('/p6/api/sessions')
        .send({ username, password })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.not.objectContaining({ password: expect.any(String) })
          );
        });
    });
  });
  describe('GET /p6/api/sessions', () => {
    const { username, email, password, jwt } = VALID_MOCK_USER;
    it('Gets user with JWT authorization header ', async () => {
      await request(app)
        .get('/p6/api/sessions')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({ username, email, jwt })
          );
        });
    });
  });
});