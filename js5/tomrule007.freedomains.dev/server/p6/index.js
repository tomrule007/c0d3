const router = require('express').Router();
const fs = require('fs').promises;
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

//TODO: ENCRYPT PASSWORD
// Mock User for testing
const VALID_MOCK_USER = {
  username: 'testUser',
  email: 'test@mock.com',
  password: 'shouldBeEncrypted',
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

router.post('/api/users', (req, res) => {
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

  //Create user
  users.push({ password, username, email });

  return res.status(400).json('the unfinished end');
});

router.post('/api/sessions', (req, res) => {
  const { username, email, password } = req.body;
  //TODO: create and send jwt
  const { password: userPassword, ...user } = username
    ? getUserByKeyValue({ username })
    : email
    ? getUserByKeyValue({ email })
    : null;

  if (!user || !password)
    return res.status(400).json({ error: { message: 'User not found' } });

  if (userPassword && userPassword === password) res.status(200).json(user);
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
