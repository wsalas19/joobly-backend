import { Router } from 'express';
import JobsController from '../controllers/JobsController.js';
import upload from '../multer.js';

const jobRouter = new Router();

jobRouter.post('/jobs', JobsController.createJobs);
jobRouter.get('/job-options', JobsController.getJobOptions);
jobRouter.get('/jobs', JobsController.getAllJobs);
jobRouter.get('/jobs/:id', JobsController.getOneJob);
jobRouter.delete('/jobs/:id', JobsController.deleteJob);
jobRouter.post('/upload', upload.single('upload'), JobsController.upload);

export default jobRouter;
