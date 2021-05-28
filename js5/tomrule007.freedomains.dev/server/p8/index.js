const router = require('express').Router();
const fs = require('fs').promises;
const md5 = require('md5');
const path = require('path');

const USER_SELFIE_PATH = './public/p8/selfie/';

router.post('/api/selfie', async (req, res) => {
  const { selfie } = req.body;
  if (!selfie)
    return res
      .status(400)
      .json({ error: { message: "Missing 'selfie' field" } });

  const uniqueName = md5(selfie).concat('.png');

  await fs.writeFile(
    USER_SELFIE_PATH + uniqueName,
    selfie.split(',').pop(), //Insures the user didn't include meta data
    'base64'
  );

  res.status(200).json({ link: '/p8/selfie/' + uniqueName });
});

router.get('/api/selfie', async (req, res) => {
  const selfies = await fs.readdir(USER_SELFIE_PATH);
  console.log(selfies);
  res.status(500).json('unfinished endpoint');
});

module.exports = router;
// Used for cleaning up after tests
module.exports.USER_SELFIE_PATH = USER_SELFIE_PATH;
