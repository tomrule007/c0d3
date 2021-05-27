const router = require('express').Router();
const fs = require('fs').promises;
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) =>
      err ? reject(err) : resolve(hash)
    );
  });

const verifyPassword = (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });

// Mock User for testing
const VALID_MOCK_USER_PASSWORD = 'superSecure';
const VALID_MOCK_USER = {
  username: 'testUser',
  email: 'test@mock.com',
  hash: '$2b$10$La1oIdvnCAUfHPLkc0onqe09pfZlhDVi8LRw8eMPWcGtvpQLIV7je',
  jwt: 'fakeJWTtoStart',
};

const users = process.env.NODE_ENV === 'test' ? [VALID_MOCK_USER] : [];

const isUniqueUsername = (username) =>
  !users.some((user) => user.username === username);

const getUserByKeyValue = (keyValue) =>
  users.find((user) => {
    const [[key, value]] = Object.entries(keyValue);

    return user[key] === value;
  });

router.post('/api/users', async (req, res) => {
  const { password, username, email } = req.body;
  //TODO: ENCRYPT PASSWORD

  if (!password || password.length <= 5)
    return res.status(400).json({
      error: {
        message:
          'password field cannot be empty and must be base 64 encoded with more than 5 characters',
      },
    });

  const alphaNumericOnly = /^[a-z09]+$/i;
  if (!username || !alphaNumericOnly.test(username))
    return res.status(400).json({
      error: {
        message:
          'username field cannot be blank and must contain alpha numeric characters only',
      },
    });

  if (!isUniqueUsername(username))
    return res.status(400).json({
      error: {
        message: 'username is already registered',
      },
    });

  const validEmail = /^\w+@\w+\.?\w*$/;
  if (!email || !validEmail.test(email))
    return res.status(400).json({
      error: {
        message: 'email field cannot be blank and must be a valid email',
      },
    });

  // Create user
  await encryptPassword(password)
    .then((hash) => {
      const newUser = { email, username, hash, id: uuidv4() };
      users.push(newUser);
      res.status(200).json(newUser);
    })
    .catch((err) => {
      console.log('encryptPassword', err);
      return res.status(500).json('Internal Server Error');
    });
});

router.post('/api/sessions', async (req, res) => {
  const { username, email, password } = req.body;
  if (username && email)
    return res.status(400).json({
      error: { message: 'Only send password with email OR username' },
    });

  const { hash, ...user } = username
    ? getUserByKeyValue({ username })
    : email
    ? getUserByKeyValue({ email })
    : null;

  if (!user || !hash)
    return res.status(400).json({ error: { message: 'User not found' } });

  verifyPassword(password, hash)
    .then((isValidPassword) => {
      if (!isValidPassword)
        return res.status(400).json({ error: { message: 'User not found' } });

      // create jwt
      // TODO: CREATE AND RETURN JWT

      return res.status(200).json({ ...user, jwt: 'mynewjwt' });
    })
    .catch((err) => {
      console.log('encryptPassword', err);
      return res.status(500).json('Internal Server Error');
    });
});

router.get('/api/sessions', (req, res) => {
  const jwt = (req.headers.authorization || '').split(' ').pop();

  if (jwt) {
    //TODO: Change to decode verify
    const { password, ...user } = getUserByKeyValue({ jwt });

    if (user) return res.status(200).json(user);
  }

  return res.status(400).json({ error: { message: 'Not logged in' } });
});

module.exports = router;
module.exports.VALID_MOCK_USER = VALID_MOCK_USER;
module.exports.VALID_MOCK_USER_PASSWORD = VALID_MOCK_USER_PASSWORD;
