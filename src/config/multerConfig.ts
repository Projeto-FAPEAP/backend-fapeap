/* eslint-disable @typescript-eslint/explicit-function-return-type */
import multer from 'multer';
import aws from 'aws-sdk';
import path from 'path';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

export const disk = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'temp'),
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(8).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

// Credenciais
const s3 = new aws.S3({
  accessKeyId: 'AKIAJAUTQJGXWFKY4VEA',
  secretAccessKey: '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',
});

// eslint-disable-next-line consistent-return
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const fileTypes = /jpeg|jpg|png|mp4|mpeg/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  const error = new Error('Error: Apenas .jpeg, .jpg, .png, .mp4 e .mpeg');
  cb(error);
}

export const awsStorageFiles = multer({
  storage: multerS3({
    s3,
    bucket: 'app-ws-fapeap',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
