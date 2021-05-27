const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// TODO: Handle temp file storage cleanup
const upload = multer({ dest: './data/p7/' });

const jobs = [];

// createJob: Files -> JobId
const createTextExtractJob = (files) => {
  const jobId = uuidv4();

  return jobId;
};

const FILE_FIELD = 'userFiles';
const MAX_FILE_COUNT = 10;
router.post('/files', upload.array(FILE_FIELD, MAX_FILE_COUNT), (req, res) => {
  console.log('im here', req.files);

  const jobId = createTextExtractJob(req.files);
  return res.status(202).json(jobId);
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let errResponse;
    switch (err.code) {
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400);
        errResponse = {
          error: {
            message: `Unexpected field: ${err.field}  (only send: ${FILE_FIELD}) `,
          },
        };
        break;

      default:
        res.status(500);
        errResponse = {
          error: err,
        };

        break;
    }
    return res.json(errResponse);
  }
  next(err);
});

module.exports = router;
