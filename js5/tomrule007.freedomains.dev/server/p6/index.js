const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { promisify } = require('../utilities');

// ! Would be environment variable in real app
const SECRET_JWT_KEY = 'moreLikePublicKey';

const createJwtToken = promisify(jwt.sign);
const verifyJwtToken = promisify(jwt.verify);
const encryptPassword = promisify(bcrypt.hash);
const verifyPassword = promisify(bcrypt.compare);

const users = require('./lib/users').getUsers();

const isUniqueUsername = (username) =>
  !users.some((user) => user.username === username);

const isUniqueEmail = (email) => !users.some((user) => user.email === email);

const getUserByKeyValue = (keyValue) =>
  users.find((user) => {
    const [[key, value]] = Object.entries(keyValue);

    return user[key] === value;
  });

const errMsg = (message) => ({
  error: { message },
});

router.post('/api/users', async (req, res) => {
  const { password, username, email, ...extras } = req.body;
  if (!password || password.length <= 5)
    return res
      .status(400)
      .json(
        errMsg(
          'password field cannot be empty and must be base 64 encoded with more than 5 characters'
        )
      );

  const alphaNumericOnly = /^[a-z0-9]+$/i;
  if (!username || !alphaNumericOnly.test(username))
    return res
      .status(400)
      .json(
        errMsg(
          'username field cannot be blank and must contain alpha numeric characters only'
        )
      );

  if (!isUniqueUsername(username))
    return res.status(400).json(errMsg('username is already registered'));

  const validEmail = /^\w+@\w+\.?\w*$/;
  if (!email || !validEmail.test(email))
    return res
      .status(400)
      .json(errMsg('email field cannot be blank and must be a valid email'));

  if (!isUniqueEmail(email))
    return res.status(400).json(errMsg('Email is already registered'));
  // Create user
  try {
    const saltRounds = 10;
    const hash = await encryptPassword(password, saltRounds);

    const newUser = { email, username, id: uuidv4(), ...extras };
    users.push({ ...newUser, hash });

    const jwt = await createJwtToken(newUser, SECRET_JWT_KEY, {
      algorithm: 'HS256',
    });

    return res.json({ ...newUser, jwt });
  } catch (err) {
    console.log('encryptPassword', err);
    return res.status(500).json('Internal Server Error');
  }
});

router.post('/api/sessions', async (req, res) => {
  const { username, email, password } = req.body;
  if (username && email)
    return res
      .status(400)
      .json(errMsg('Only send password with email OR username'));

  const { hash, ...user } = username
    ? getUserByKeyValue({ username })
    : email
    ? getUserByKeyValue({ email })
    : null;

  if (!user || !hash) return res.status(400).json(errMsg('User not found'));

  try {
    if (!(await verifyPassword(password, hash)))
      return res.status(400).json(errMsg('User not found'));

    const jwt = await createJwtToken(user, SECRET_JWT_KEY, {
      algorithm: 'HS256',
    });

    return res.json({ ...user, jwt });
  } catch (error) {
    console.log('encryptPassword', err);
    return res.status(500).json('Internal Server Error');
  }
});

router.get('/api/sessions', async (req, res) => {
  const jwt = (req.headers.authorization || '').split(' ').pop();
  if (!jwt) return res.status(400).json(errMsg('Not logged in'));

  const expireTime = Math.floor(Date.now() / 1000) - 60 * 60; // Token expires after 1hr
  try {
    const { iat, ...payload } = await verifyJwtToken(jwt, SECRET_JWT_KEY);

    if (payload && iat > expireTime) return res.json({ ...payload, jwt });

    return res.status(400).json(errMsg('Not logged in'));
  } catch (err) {
    console.log('verifyJwtToken', err);
    return res.status(500).json('Internal Server Error');
  }
});

module.exports = router;
