import { Router } from 'express';
import multer from 'multer';
import ResumeController from '../controllers/ResumeController.js';
import { check } from 'express-validator';
const resumeRouter = new Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const upload = multer({ storage });

resumeRouter.post(
  '/upload-resume',
  [check('email', 'Please enter a valid email').isEmail()],
  upload.single('file'),
  ResumeController.createResume
);
resumeRouter.get('/resumes', ResumeController.getResumes);

export default resumeRouter;
