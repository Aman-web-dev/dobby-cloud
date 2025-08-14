import express from 'express';
import {signup,login} from '../controller/authController.js'

const AuthRouter = express.Router();

AuthRouter.post('/signup', signup);
AuthRouter.post('/login', login);

export default AuthRouter;
