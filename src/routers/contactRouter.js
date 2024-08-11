import { Router } from 'express';
import ContactController from '../controllers/ContactController.js';

const contactRouter = new Router();

contactRouter.post('/sendEmail', ContactController.sendEmail);

export default contactRouter;
